# Carbon Oracle Program

A Solana program that serves as an oracle for carbon pricing and vehicle consumption data by region. This program enables applications to calculate carbon emissions and costs for travel based on real-world data.

## Features

- **Carbon Price Tracking**: Maintains up-to-date carbon price per ton
- **Regional Consumption Data**: Stores vehicle consumption rates by region
- **Multi-vehicle Support**: Tracks consumption for standard, electric, and hybrid vehicles
- **Emission Calculations**: Calculates carbon emissions and costs for trips
- **Authorized Updates**: Only the oracle authority can update data

## Program Structure

### Key Accounts

- **CarbonOracle**: Main account storing carbon price and region data

### Main Instructions

1. **Initialize**: Set up the oracle with an authority
2. **UpdateCarbonPrice**: Set/update the current carbon price per ton
3. **UpdateRegionData**: Add or update consumption data for a region
4. **CalculateTripCarbon**: Calculate carbon emissions and cost for a trip

## Data Units

- Carbon price is stored in **USD cents per ton**
- Standard vehicle consumption is in **ml of fuel per km**
- Electric vehicle consumption is in **Wh per km**
- Hybrid vehicle consumption is in **ml of fuel per km**
- Emission factors are in **g CO2 per unit consumed**
- Carbon emissions are calculated in **grams**
- Carbon costs are calculated in **microcents** (millionths of a dollar)

## Usage Example

```typescript
// Initialize the oracle
await program.methods
  .initialize()
  .accounts({
    oracle: oracleAccount.publicKey,
    authority: wallet.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .signers([oracleAccount])
  .rpc();

// Update carbon price to $30 per ton
await program.methods
  .updateCarbonPrice(new anchor.BN(3000))
  .accounts({
    oracle: oracleAccount.publicKey,
    authority: wallet.publicKey,
  })
  .rpc();

// Add region data
await program.methods
  .updateRegionData(
    "EU-WEST",    // Region code
    70,           // Standard vehicle consumption (ml/km)
    180,          // Electric vehicle consumption (Wh/km)
    40,           // Hybrid vehicle consumption (ml/km)
    2400          // Emission factor (g CO2 per unit)
  )
  .accounts({
    oracle: oracleAccount.publicKey,
    authority: wallet.publicKey,
  })
  .rpc();

// Calculate trip carbon
const tripCalculation = await program.methods
  .calculateTripCarbon(
    "EU-WEST",              // Region
    { standard: {} },       // Vehicle type (standard, electric, or hybrid)
    100                     // Distance in km
  )
  .accounts({
    oracle: oracleAccount.publicKey,
  })
  .view();

console.log("Carbon emissions:", tripCalculation.carbonEmissionsGrams.toString(), "g");
console.log("Carbon cost:", tripCalculation.carbonCostMicrocents.toString(), "microcents");
```

## Deployment

The program is deployed on Solana with the following addresses:

- Devnet: `CarbN2rxkvGLJQECuKJ4y931xCGwbmL3Bbmi7W8KFjmT` 