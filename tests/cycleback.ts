import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Cycleback } from "../target/types/cycleback";
import { 
  PublicKey, 
  Keypair, 
  SystemProgram 
} from "@solana/web3.js";
import { 
  TOKEN_PROGRAM_ID,
  createMint,
  createAssociatedTokenAccount,
  getAccount
} from "@solana/spl-token";
import * as crypto from "crypto";
import { assert } from "chai";

// Helper function to generate a unique transaction ID
function generateTransactionId(): Uint8Array {
  // Generate a random 32-byte array for transaction ID
  return crypto.randomBytes(32);
}

// Update the IDL type to include the transactionId parameter
// This is needed because the generated types don't include our new parameter yet
interface CustomMintTokensArgs {
  vehicleType: string;
  meters: anchor.BN;
  transactionId: number[];
}

describe("cycleback", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Cycleback as Program<Cycleback>;
  const wallet = provider.wallet as anchor.Wallet;

  // Program state account
  const stateAccount = Keypair.generate();

  // Test token mint for cycleback tokens
  const cyclebackMint = Keypair.generate();
  let userTokenAccount: PublicKey;

  // Default values for initialization
  const initialScooterRate = new anchor.BN(5); // 5 tokens per meter for scooters
  const initialBikeRate = new anchor.BN(10);  // 10 tokens per meter for bikes
  const initialElectricBikeRate = new anchor.BN(8); // 8 tokens per meter for electric vehicles

  // Store transaction IDs to demonstrate duplicate checking
  const usedTransactionIds: Uint8Array[] = [];

  it("Initializes the program", async () => {
    console.log("Initializing program with state account:", stateAccount.publicKey.toString());
    
    // First prepare the instruction with just the arguments
    const method = program.methods
      .initialize(
        initialScooterRate,
        initialBikeRate,
        initialElectricBikeRate
      );
      
    // Then get the proper accounts context shape from Anchor
    const accountsContext = {
      stateAccount: stateAccount.publicKey,
      owner: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    };
    
    // Execute with properly shaped accounts structure
    const tx = await method
      .accounts(accountsContext)
      .signers([stateAccount])
      .rpc();

    console.log("Program initialized! Tx signature:", tx);

    // Verify the values were set correctly
    const state = await program.account.programState.fetch(stateAccount.publicKey);
    console.log("Scooter rate:", state.scooterRewardRate.toString());
    console.log("Bike rate:", state.bikeRewardRate.toString());
    console.log("Electric bike rate:", state.electricBikeRewardRate.toString());
    
    // Verify owner was set correctly
    console.log("Owner:", state.owner.toString());
    console.log("Wallet:", wallet.publicKey.toString());
  });

  it("Updates the scooter rate", async () => {
    console.log("Updating scooter rate...");
    
    const newScooterRate = new anchor.BN(7); // 7 tokens per meter
    
    // Prepare method and accounts separately
    const method = program.methods
      .updateValueScooterRewardRate(newScooterRate);
      
    const accountsContext = {
      stateAccount: stateAccount.publicKey,
      owner: wallet.publicKey,
    };
    
    const tx = await method
      .accounts(accountsContext)
      .rpc();
      
    console.log("Scooter rate updated! Tx signature:", tx);
    
    // Verify the update
    const state = await program.account.programState.fetch(stateAccount.publicKey);
    console.log("New scooter rate:", state.scooterRewardRate.toString());
  });

  it("Updates the bike rate", async () => {
    console.log("Updating bike rate...");
    
    const newBikeRate = new anchor.BN(12); // 12 tokens per meter
    
    // Prepare method and accounts separately
    const method = program.methods
      .updateValueBikeRewardRate(newBikeRate);
      
    const accountsContext = {
      stateAccount: stateAccount.publicKey,
      owner: wallet.publicKey,
    };
    
    const tx = await method
      .accounts(accountsContext)
      .rpc();
      
    console.log("Bike rate updated! Tx signature:", tx);
    
    // Verify the update
    const state = await program.account.programState.fetch(stateAccount.publicKey);
    console.log("New bike rate:", state.bikeRewardRate.toString());
  });

  it("Updates the electric rate", async () => {
    console.log("Updating electric rate...");
    
    const newElectricRate = new anchor.BN(15); // 15 tokens per meter
    
    // Prepare method and accounts separately
    const method = program.methods
      .updateValueElectricBikeRewardRate(newElectricRate);
      
    const accountsContext = {
      stateAccount: stateAccount.publicKey,
      owner: wallet.publicKey,
    };
    
    const tx = await method
      .accounts(accountsContext)
      .rpc();
      
    console.log("Electric rate updated! Tx signature:", tx);
    
    // Verify the update
    const state = await program.account.programState.fetch(stateAccount.publicKey);
    console.log("New electric bike rate:", state.electricBikeRewardRate.toString());
  });

  it("Creates token mint and user token account", async () => {
    console.log("Creating cycleback token mint...");
    
    // Create the cycleback token mint
    await createMint(
      provider.connection,
      wallet.payer,
      wallet.publicKey, // mint authority
      wallet.publicKey, // freeze authority (none)
      9, // 9 decimals
      cyclebackMint
    );
    
    console.log("cycleback token mint created:", cyclebackMint.publicKey.toString());
    
    // Create the user's token account
    userTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      wallet.payer,
      cyclebackMint.publicKey,
      wallet.publicKey
    );
    
    console.log("User token account created:", userTokenAccount.toString());
  });

  it("Mints tokens for scooter ride", async () => {
    console.log("Minting tokens for scooter ride...");
    
    const meters = new anchor.BN(100); // 100 meters traveled
    const transactionId = generateTransactionId();
    usedTransactionIds.push(transactionId);
    
    // Get the standard accounts structure for minting
    const accounts = {
      stateAccount: stateAccount.publicKey,
      mint: cyclebackMint.publicKey,
      tokenAccount: userTokenAccount,
      owner: wallet.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
    };
    
    // Call the RPC method directly with the accounts and arguments
    const tx = await program.rpc.mintTokens(
      "scooter", 
      meters, 
      Array.from(transactionId),
      {
        accounts: accounts
      }
    );
      
    console.log("Tokens minted for scooter ride! Tx signature:", tx);
    
    // Get token balance
    const tokenAccount = await getAccount(provider.connection, userTokenAccount);
    console.log("Token balance after scooter ride:", tokenAccount.amount.toString());
  });

  it("Mints tokens for bike ride", async () => {
    console.log("Minting tokens for bike ride...");
    
    const meters = new anchor.BN(50); // 50 meters traveled
    const transactionId = generateTransactionId();
    usedTransactionIds.push(transactionId);
    
    // Get the standard accounts structure for minting
    const accounts = {
      stateAccount: stateAccount.publicKey,
      mint: cyclebackMint.publicKey,
      tokenAccount: userTokenAccount,
      owner: wallet.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
    };
    
    // Call the RPC method directly with the accounts and arguments
    const tx = await program.rpc.mintTokens(
      "bike", 
      meters, 
      Array.from(transactionId),
      {
        accounts: accounts
      }
    );
      
    console.log("Tokens minted for bike ride! Tx signature:", tx);
    
    // Get token balance
    const tokenAccount = await getAccount(provider.connection, userTokenAccount);
    console.log("Token balance after bike ride:", tokenAccount.amount.toString());
  });

  it("Mints tokens for electric ride", async () => {
    console.log("Minting tokens for electric ride...");
    
    const meters = new anchor.BN(75); // 75 meters traveled
    const transactionId = generateTransactionId();
    usedTransactionIds.push(transactionId);
    
    // Get the standard accounts structure for minting
    const accounts = {
      stateAccount: stateAccount.publicKey,
      mint: cyclebackMint.publicKey,
      tokenAccount: userTokenAccount,
      owner: wallet.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
    };
    
    // Call the RPC method directly with the accounts and arguments
    const tx = await program.rpc.mintTokens(
      "electric", 
      meters, 
      Array.from(transactionId),
      {
        accounts: accounts
      }
    );
      
    console.log("Tokens minted for electric ride! Tx signature:", tx);
    
    // Get token balance
    const tokenAccount = await getAccount(provider.connection, userTokenAccount);
    console.log("Final token balance:", tokenAccount.amount.toString());
  });

  it("Rejects duplicate transaction ID", async () => {
    console.log("Testing duplicate transaction ID rejection...");
    
    const meters = new anchor.BN(30); // 30 meters traveled
    // Use a previously used transaction ID to test duplicate detection
    const duplicateTransactionId = usedTransactionIds[0];
    
    try {
      // Get the standard accounts structure for minting
      const accounts = {
        stateAccount: stateAccount.publicKey,
        mint: cyclebackMint.publicKey,
        tokenAccount: userTokenAccount,
        owner: wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      };
      
      // Call the RPC method directly with the accounts and arguments
      await program.rpc.mintTokens(
        "scooter", 
        meters, 
        Array.from(duplicateTransactionId),
        {
          accounts: accounts
        }
      );
        
      assert.fail("The transaction should have failed due to duplicate transaction ID");
    } catch (error) {
      console.log("Successfully rejected duplicate transaction ID");
      console.log("Error:", error.message);
      // Verify that the error is due to duplicate transaction ID
      assert.ok(error.message.includes("DuplicateTransactionId"));
    }
  });
});
