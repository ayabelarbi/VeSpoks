import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { Cycleback } from "../../../../target/types/cycleback";
import * as fs from 'fs';
import * as path from 'path';

const idlPath = path.join(__dirname, '../../../../target/idl/cycleback.json');
const idl = JSON.parse(fs.readFileSync(idlPath, 'utf8'));

export async function updateBikeParams(
  connection: Connection,
  daoKey: PublicKey,
  rideValues: number,
) { 
  const secretKey = Uint8Array.from(JSON.parse(process.env.SECRET_KEY || '[]'));
  const keypair = Keypair.fromSecretKey(secretKey);
  const provider = new AnchorProvider(connection, new Wallet(keypair), {});
  const program = new Program<Cycleback>(idl as any, provider);

  try {
    const tx = await program.methods
      .updateValueCyclebackPerBikeMeters(new anchor.BN(rideValues))
      .accounts({
        stateAccount: daoKey,
        owner: provider.wallet.publicKey,
      })
      .rpc();
    
    return tx;
  } catch (error) {
    console.error("Error updating bike params:", error);
    throw error;
  }
}

export async function updateEBikeParams(
  connection: Connection,
  daoKey: PublicKey,
  rideValues: number,
) { 
  const secretKey = Uint8Array.from(JSON.parse(process.env.SECRET_KEY || '[]'));
  const keypair = Keypair.fromSecretKey(secretKey);
  const provider = new AnchorProvider(connection, new Wallet(keypair), {});
  const program = new Program<Cycleback>(idl as any, provider);

  try {
    const tx = await program.methods
      .updateValueCyclebackPerBikeMeters(new anchor.BN(rideValues))
      .accounts({
        stateAccount: daoKey,
        owner: provider.wallet.publicKey,
      })
      .rpc();
    
    return tx;
  } catch (error) {
    console.error("Error updating bike params:", error);
    throw error;
  }
}

export async function updateScooterParams(
  connection: Connection,
  daoKey: PublicKey,
  rideValues: number,
) { 
  const secretKey = Uint8Array.from(JSON.parse(process.env.SECRET_KEY || '[]'));
  const keypair = Keypair.fromSecretKey(secretKey);
  const provider = new AnchorProvider(connection, new Wallet(keypair), {});
  const program = new Program<Cycleback>(idl as any, provider);

  try {
    const tx = await program.methods
      .updateValueCyclebackPerScooterMeters(new anchor.BN(rideValues))
      .accounts({
        stateAccount: daoKey,
        owner: provider.wallet.publicKey,
      })
      .rpc();
    
    return tx;
  } catch (error) {
    console.error("Error updating bike params:", error);
    throw error;
  }
}

export async function updateEScooterParams(
  connection: Connection,
  daoKey: PublicKey,
  rideValues: number,
) { 
  const secretKey = Uint8Array.from(JSON.parse(process.env.SECRET_KEY || '[]'));
  const keypair = Keypair.fromSecretKey(secretKey);
  const provider = new AnchorProvider(connection, new Wallet(keypair), {});
  const program = new Program<Cycleback>(idl as any, provider);

  try {
    const tx = await program.methods
      .updateValueCyclebackPerScooterMeters(new anchor.BN(rideValues))
      .accounts({
        stateAccount: daoKey,
        owner: provider.wallet.publicKey,
      })
      .rpc();
    
    return tx;
  } catch (error) {
    console.error("Error updating bike params:", error);
    throw error;
  }
}