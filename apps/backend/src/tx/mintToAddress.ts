import "dotenv/config";
export type RideTypes = "scooter" | "escooter" | "bike";

import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  SystemProgram,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import * as anchor from "@project-serum/anchor";
import { programId, stateAccount } from "../utls/constants";
import { adminKeypair } from "../utls/adminKeypair";

// Core method for minting tokens
export async function mintToAddress(
  vehicleType: string,
  meters: number,
  transactionId: Uint8Array,
  recipientAddress: PublicKey
): Promise<string> {

  // Connect to Solana devnet
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  // Use recipient address or wallet's address if not provided
  const recipient = recipientAddress;


  // Create a new mint keypair
  const mintKeypair = Keypair.generate();

  // Calculate rent for mint
  const rentForMint = await getMinimumBalanceForRentExemptMint(connection);

  // Get associated token address
  const associatedTokenAddress = await getAssociatedTokenAddress(
    mintKeypair.publicKey,
    recipient
  );

  // Convert meters to BN
  const metersBN = new anchor.BN(meters);

  // Create IDL for program
  const IDL = {
    version: "0.1.0",
    name: "cycleback",
    instructions: [
      {
        name: "mint_tokens",
        accounts: [
          { name: "stateAccount", isMut: true, isSigner: false },
          { name: "mint", isMut: true, isSigner: false },
          { name: "tokenAccount", isMut: true, isSigner: false },
          { name: "owner", isMut: false, isSigner: true },
          { name: "tokenProgram", isMut: false, isSigner: false },
        ],
        args: [
          { name: "vehicleType", type: "string" },
          { name: "distance", type: "u64" },
          { name: "transactionId", type: { array: ["u8", 32] } },
        ],
      },
    ],
  };

  // Create provider and program
  const provider = new anchor.AnchorProvider(
    connection,
    new anchor.Wallet(adminKeypair),
    { commitment: "confirmed" }
  );

  const program = new anchor.Program(IDL as any, programId, provider);

  // Create mint_tokens instruction
  const mintTokensIx = await program.methods
    .mintTokens(vehicleType, metersBN, Array.from(transactionId))
    .accounts({
      stateAccount: stateAccount,
      mint: mintKeypair.publicKey,
      tokenAccount: associatedTokenAddress,
      owner: adminKeypair.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();

  // Create transaction with all necessary instructions
  const transaction = new Transaction();

  // Add instruction to create mint account
  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: adminKeypair.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: MINT_SIZE,
      lamports: rentForMint,
      programId: TOKEN_PROGRAM_ID,
    })
  );

  // Add instruction to initialize mint
  transaction.add(
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      9, // 9 decimals
      adminKeypair.publicKey,
      adminKeypair.publicKey
    )
  );

  // Add instruction to create associated token account
  transaction.add(
    createAssociatedTokenAccountInstruction(
        adminKeypair.publicKey,
      associatedTokenAddress,
      recipient,
      mintKeypair.publicKey
    )
  );

  // Add mint_tokens instruction
  transaction.add(mintTokensIx);

  // Finalize transaction
  transaction.feePayer = adminKeypair.publicKey;
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash()
  ).blockhash;

  // Sign and send transaction
  const signature = await sendAndConfirmTransaction(connection, transaction, [
    adminKeypair,
    mintKeypair,
  ]);

  return signature;
}
