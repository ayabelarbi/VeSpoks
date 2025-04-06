import fs from "fs";
import { Keypair } from "@solana/web3.js";
import path from "path";
import os from "os";

// Helper function to expand tilde in paths
function expandTildePath(filePath: string): string {
  if (filePath.startsWith('~')) {
    return path.join(os.homedir(), filePath.slice(1));
  }
  return filePath;
}

// Try to load Solana keypair
let adminSecretKey: Uint8Array;

try {
  // First try environment variable
  if (process.env.PRIVATE_KEY) {
    adminSecretKey = Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY));
    console.log('Using Solana keypair from environment variable');
  } 
  // Then try the standard Solana CLI location
  else {
    const solanaConfigPath = expandTildePath('~/.config/solana/id.json');
    adminSecretKey = Uint8Array.from(
      JSON.parse(fs.readFileSync(solanaConfigPath, "utf-8"))
    );
    console.log(`Using Solana keypair from: ${solanaConfigPath}`);
  }
} catch (error) {
  console.error('Error loading Solana keypair:', error);
  throw new Error(
    'Failed to load Solana keypair. Please ensure either:\n' +
    '1. PRIVATE_KEY environment variable is set, or\n' +
    '2. Solana CLI keypair exists at ~/.config/solana/id.json\n' +
    'You can generate a keypair using: solana-keygen new --outfile ~/.config/solana/id.json'
  );
}

export const adminKeypair = Keypair.fromSecretKey(adminSecretKey);