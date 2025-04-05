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

  it("Initializes the program", async () => {
    console.log("Initializing program with state account:", stateAccount.publicKey.toString());
    
    // First prepare the instruction with just the arguments
    const method = program.methods
      .initialize(
        initialScooterRate,
        initialBikeRate
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
    console.log("Scooter rate:", state.cyclebackPerScooterMeters.toString());
    console.log("Bike rate:", state.cyclebackPerBikeMeters.toString());
    
    // Verify owner was set correctly
    console.log("Owner:", state.owner.toString());
    console.log("Wallet:", wallet.publicKey.toString());
  });

  it("Updates the scooter rate", async () => {
    console.log("Updating scooter rate...");
    
    const newScooterRate = new anchor.BN(7); // 7 tokens per meter
    
    // Prepare method and accounts separately
    const method = program.methods
      .updateValueCyclebackPerScooterMeters(newScooterRate);
      
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
    console.log("New scooter rate:", state.cyclebackPerScooterMeters.toString());
  });

  it("Updates the bike rate", async () => {
    console.log("Updating bike rate...");
    
    const newBikeRate = new anchor.BN(12); // 12 tokens per meter
    
    // Prepare method and accounts separately
    const method = program.methods
      .updateValueCyclebackPerBikeMeters(newBikeRate);
      
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
    console.log("New bike rate:", state.cyclebackPerBikeMeters.toString());
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
    
    // Prepare method and accounts separately
    const method = program.methods
      .mintTokens("scooter", meters);
      
    const accountsContext = {
      stateAccount: stateAccount.publicKey,
      mint: cyclebackMint.publicKey,
      tokenAccount: userTokenAccount,
      owner: wallet.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
    };
    
    const tx = await method
      .accounts(accountsContext)
      .rpc();
      
    console.log("Tokens minted for scooter ride! Tx signature:", tx);
    
    // Get token balance
    const tokenAccount = await getAccount(provider.connection, userTokenAccount);
    console.log("Token balance after scooter ride:", tokenAccount.amount.toString());
  });

  it("Mints tokens for bike ride", async () => {
    console.log("Minting tokens for bike ride...");
    
    const meters = new anchor.BN(50); // 50 meters traveled
    
    // Prepare method and accounts separately
    const method = program.methods
      .mintTokens("bike", meters);
      
    const accountsContext = {
      stateAccount: stateAccount.publicKey,
      mint: cyclebackMint.publicKey,
      tokenAccount: userTokenAccount,
      owner: wallet.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
    };
    
    const tx = await method
      .accounts(accountsContext)
      .rpc();
      
    console.log("Tokens minted for bike ride! Tx signature:", tx);
    
    // Get token balance
    const tokenAccount = await getAccount(provider.connection, userTokenAccount);
    console.log("Final token balance:", tokenAccount.amount.toString());
  });
});
