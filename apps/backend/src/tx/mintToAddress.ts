import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { Connection, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import { createMintToInstruction } from "@solana/spl-token";

export type RideTypes = "scooter" | "escooter" | "bike";

export async function mintToAd2(
  connection: Connection,
  tokenAddress: PublicKey,
  account: PublicKey,
  rideType: string,
  quantity: number,
) {
  if (tokenAddress === undefined) {
    throw new Error("Token address is undefined")
  }

  const mintInstruction = createMintToInstruction(
    tokenAddress,
    account,
    getKeypairFromEnvironment("SECRET_KEY").publicKey,
    quantity
  );

  const transferInstruction = SystemProgram.transfer({
    fromPubkey: new PublicKey(process.env.TOKEN_ADDRESS!),
    toPubkey: account,
    lamports: quantity * LAMPORTS_PER_SOL,
    programId: new PublicKey(process.env.TOKEN_ADDRESS!),
  });

  const transaction = new Transaction().add(mintInstruction, transferInstruction);
  const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [
      getKeypairFromEnvironment("SECRET_KEY"),
    ],
  );

  return transactionSignature
}

