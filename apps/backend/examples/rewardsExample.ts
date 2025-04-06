import { PublicKey } from "@solana/web3.js";
import { Rewards } from "../src/tx/rewards";

async function main() {
  try {
    // Initialize the rewards system with your configuration
    const rewards = new Rewards({
      tokenKey: new PublicKey(process.env.VE_BOOM || ""),
      daoKey: new PublicKey(process.env.VE_BOOM || ""), // Replace with your DAO's public key
      network: "devnet" // Use "mainnet-beta" for production
    });

    // Connect to the network
    console.log("Connecting to devnet...");
    await rewards.connect("devnet");
    console.log("Connected successfully!");

    // Example 1: Update reward rates for different vehicle types
    console.log("\nUpdating reward rates...");
    
    // Update bike rate to 5 tokens per kilometer
    const bikeTx = await rewards.updateBikeRate(5);
    console.log("Bike rate updated. Transaction:", bikeTx);

    // Update e-bike rate to 7 tokens per kilometer
    const ebikeTx = await rewards.updateEBikeRate(7);
    console.log("E-bike rate updated. Transaction:", ebikeTx);

    // Update e-scooter rate to 6 tokens per kilometer
    const escooterTx = await rewards.updateEScooterRate(6);
    console.log("E-scooter rate updated. Transaction:", escooterTx);

    // Example 2: Mint rewards for a completed ride
    console.log("\nMinting rewards for a ride...");
    const mintTx = await rewards.mintRewards({
      account: new PublicKey("GPjxmacrzWo1JQ2YmqNycQrutf3Ki89hGSfbwtzK4zZM"), // Replace with actual recipient address
      quantity: 10, // 10 kilometers traveled
      rideType: "bike" // Type of vehicle used
    });
    console.log("Rewards minted. Transaction:", mintTx);

  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the example
main().catch(console.error); 