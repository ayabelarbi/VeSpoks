import fs from "fs";
import { Keypair } from "@solana/web3.js";

const adminSecretKey = process.env.PRIVATE_KEY
  ? Uint8Array.from(process.env.PRIVATE_KEY)
  : Uint8Array.from(
      JSON.parse(fs.readFileSync(".config/solana/id.json", "utf-8"))
    );
export const adminKeypair = Keypair.fromSecretKey(adminSecretKey);