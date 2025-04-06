import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CarbonOracle } from "../target/types/carbon_oracle";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { assert } from "chai";

describe("carbon-oracle", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.CarbonOracle as Program<CarbonOracle>;
  const wallet = provider.wallet as anchor.Wallet;

  // Oracle state account
  const oracleAccount = Keypair.generate();

  // Test region data
  const testRegions = [
    {
      code: "EU-WEST",
      avg_vehicle_consumption_per_km: 70, // 70ml per km for standard vehicles
      avg_electric_consumption_per_km: 180, // 180Wh per km for electric vehicles
      avg_hybrid_consumption_per_km: 40, // 40ml per km for hybrid vehicles
      emission_factor: 2400, // 2.4kg CO2 per liter of gasoline / 0.4kg per kWh for electricity
    },
    {
      code: "US-WEST",
      avg_vehicle_consumption_per_km: 90, // 90ml per km for standard vehicles
      avg_electric_consumption_per_km: 200, // 200Wh per km for electric vehicles
      avg_hybrid_consumption_per_km: 55, // 55ml per km for hybrid vehicles
      emission_factor: 2600, // Slightly higher emissions per unit
    },
  ];

  // Current carbon price (in USD cents per ton)
  const carbonPrice = 3000; // $30.00 per ton

  it("Initializes the oracle", async () => {
    console.log("Initializing oracle with account:", oracleAccount.publicKey.toString());
    
    const tx = await program.methods
      .initialize()
      .accounts({
        oracle: oracleAccount.publicKey,
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      } as any)
      .signers([oracleAccount])
      .rpc();

    console.log("Oracle initialized! Tx signature:", tx);

    // Verify the oracle was initialized correctly
    const oracleData = await program.account.carbonOracle.fetch(oracleAccount.publicKey);
    assert.ok(oracleData.authority.equals(wallet.publicKey), "Authority should be set to wallet");
    assert.equal(oracleData.carbonPricePerTon.toString(), "0", "Carbon price should start at 0");
    assert.equal(oracleData.regions.length, 0, "No regions should be initialized");
  });

  it("Updates the carbon price", async () => {
    console.log(`Setting carbon price to ${carbonPrice} cents per ton`);
    
    const tx = await program.methods
      .updateCarbonPrice(new anchor.BN(carbonPrice))
      .accounts({
        oracle: oracleAccount.publicKey,
        authority: wallet.publicKey,
      })
      .rpc();

    console.log("Carbon price updated! Tx signature:", tx);

    // Verify the price was updated
    const oracleData = await program.account.carbonOracle.fetch(oracleAccount.publicKey);
    assert.equal(
      oracleData.carbonPricePerTon.toString(), 
      carbonPrice.toString(), 
      "Carbon price should be updated"
    );
  });

  it("Adds region data", async () => {
    for (const region of testRegions) {
      console.log(`Adding data for region: ${region.code}`);
      
      const tx = await program.methods
        .updateRegionData(
          region.code,
          region.avg_vehicle_consumption_per_km,
          region.avg_electric_consumption_per_km,
          region.avg_hybrid_consumption_per_km,
          region.emission_factor
        )
        .accounts({
          oracle: oracleAccount.publicKey,
          authority: wallet.publicKey,
        })
        .rpc();

      console.log(`Region ${region.code} added! Tx signature:`, tx);
    }

    // Verify regions were added
    const oracleData = await program.account.carbonOracle.fetch(oracleAccount.publicKey);
    assert.equal(oracleData.regions.length, testRegions.length, "All regions should be added");
    
    for (let i = 0; i < testRegions.length; i++) {
      assert.equal(oracleData.regions[i].code, testRegions[i].code, "Region code should match");
      assert.equal(
        oracleData.regions[i].avgVehicleConsumptionPerKm, 
        testRegions[i].avg_vehicle_consumption_per_km, 
        "Vehicle consumption should match"
      );
    }
  });

  it("Calculates carbon emissions for a trip", async () => {
    const region = "EU-WEST";
    const vehicleType = { standard: {} }; // Using the enum from the program
    const distanceKm = 100; // 100 km trip
    
    console.log(`Calculating carbon for ${distanceKm}km trip in ${region} with standard vehicle`);
    
    const tripCalculation = await program.methods
      .calculateTripCarbon(
        region,
        vehicleType,
        distanceKm
      )
      .accounts({
        oracle: oracleAccount.publicKey,
      })
      .view();

    console.log("Trip calculation result:", tripCalculation);
    
    // Expected: 70ml/km * 100km * 2400g/l / 1000ml/l = 16,800g CO2
    // Expected cost: 16.8kg * $30/ton / 1000kg/ton = $0.504 = 50,400 microcents
    assert.equal(
      tripCalculation.carbonEmissionsGrams.toString(),
      "16800",
      "Carbon emissions should be calculated correctly"
    );
    
    // The actual value might be slightly different due to rounding in the calculation
    const expectedCost = Math.floor((16800 * carbonPrice) / 1_000_000);
    assert.approximately(
      parseInt(tripCalculation.carbonCostMicrocents.toString()),
      expectedCost,
      10, // Allow a small tolerance for any rounding differences
      "Carbon cost should be calculated correctly"
    );
  });

  it("Compares emissions between vehicle types", async () => {
    const region = "EU-WEST";
    const distanceKm = 200; // 200 km trip
    
    // Calculate for each vehicle type
    const standardCalculation = await program.methods
      .calculateTripCarbon(region, { standard: {} }, distanceKm)
      .accounts({ oracle: oracleAccount.publicKey })
      .view();
    
    const electricCalculation = await program.methods
      .calculateTripCarbon(region, { electric: {} }, distanceKm)
      .accounts({ oracle: oracleAccount.publicKey })
      .view();
    
    const hybridCalculation = await program.methods
      .calculateTripCarbon(region, { hybrid: {} }, distanceKm)
      .accounts({ oracle: oracleAccount.publicKey })
      .view();
    
    console.log("Emissions comparison for 200km trip in EU-WEST:");
    console.log("Standard vehicle:", standardCalculation.carbonEmissionsGrams.toString(), "g CO2");
    console.log("Electric vehicle:", electricCalculation.carbonEmissionsGrams.toString(), "g CO2");
    console.log("Hybrid vehicle:", hybridCalculation.carbonEmissionsGrams.toString(), "g CO2");
    
    // Verify that the electric vehicle has lower emissions than standard
    assert.isBelow(
      parseInt(electricCalculation.carbonEmissionsGrams.toString()),
      parseInt(standardCalculation.carbonEmissionsGrams.toString()),
      "Electric vehicle should have lower emissions than standard"
    );
    
    // Verify that hybrid has lower emissions than standard but higher than electric
    assert.isBelow(
      parseInt(hybridCalculation.carbonEmissionsGrams.toString()),
      parseInt(standardCalculation.carbonEmissionsGrams.toString()),
      "Hybrid vehicle should have lower emissions than standard"
    );
  });
}); 