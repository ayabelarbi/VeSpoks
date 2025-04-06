import "dotenv/config";
import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction
} from "@solana/web3.js";
import {createMintToInstruction} from "@solana/spl-token";

export type RideTypes = "scooter" | "escooter" | "bike";

export async function mintToAddress(
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
        Keypair.fromSecretKey(Uint8Array.of(221, 206, 77, 200, 167, 224, 156, 181, 172, 89, 85, 189, 219, 59, 164, 232, 89, 199, 249, 115, 24, 182, 208, 249, 113, 94, 17, 195, 191, 44, 245, 84, 1, 106, 184, 102, 220, 123, 113, 18, 6, 13, 141, 26, 10, 71, 177, 106, 146, 200, 3, 222, 252, 162, 162, 159, 189, 42, 168, 215, 31, 22, 23, 142)).publicKey,
        quantity);

    const transferInstruction = SystemProgram.transfer({
        fromPubkey: tokenAddress,
        toPubkey: account,
        lamports: quantity * LAMPORTS_PER_SOL,
        programId: tokenAddress,
    });

    const transaction = new Transaction().add(mintInstruction, transferInstruction);
    const transactionSignature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [
            Keypair.fromSecretKey(Uint8Array.of(221, 206, 77, 200, 167, 224, 156, 181, 172, 89, 85, 189, 219, 59, 164, 232, 89, 199, 249, 115, 24, 182, 208, 249, 113, 94, 17, 195, 191, 44, 245, 84, 1, 106, 184, 102, 220, 123, 113, 18, 6, 13, 141, 26, 10, 71, 177, 106, 146, 200, 3, 222, 252, 162, 162, 159, 189, 42, 168, 215, 31, 22, 23, 142)),
            Keypair.fromSecretKey(Uint8Array.of(57, 180, 43, 158, 54, 23, 120, 44, 226, 171, 19, 130, 238, 6, 3, 163, 82, 198, 163, 120, 134, 171, 31, 147, 3, 139, 129, 103, 166, 46, 143, 138, 100, 244, 159, 10, 194, 75, 200, 21, 144, 27, 124, 47, 209, 55, 46, 108, 181, 121, 120, 57, 72, 117, 228, 18, 197, 73, 154, 17, 85, 231, 244, 45))
        ]
    );

    return transactionSignature
}

