# Cycleback Solana Program

A Solana program that manages token rewards for sustainable transportation methods. This program tracks rides by unique IDs using a bloom filter and distributes tokens based on distance traveled with different reward rates for different transportation methods.

## Features

- **Multiple Transportation Types**: Supports different reward rates for scooters, bikes, and electric vehicles
- **Token Rewards**: Mints tokens based on distance traveled
- **Unique Transaction ID Verification**: Uses a bloom filter to ensure ride IDs aren't double-counted
- **Configurable Rates**: Authority can update reward rates for each vehicle type

## Program Structure

### Key Accounts

- **ProgramState**: Main account storing reward rates and the bloom filter
- **Token Mint**: SPL token mint for reward tokens
- **Token Accounts**: User token accounts that receive rewards

### Main Instructions

1. **Initialize**: Set up the program with reward rates and authority
2. **Update Reward Rates**: Modify reward rates for different vehicle types
3. **Mint Tokens**: Reward users with tokens based on distance traveled

## Data Units

- Reward rates are in **tokens per meter**
- Distances are measured in **meters**
- Vehicle types include: "scooter", "bike", and "electric"
- Transaction IDs are unique 32-byte arrays

## Usage Example

```typescript
// Initialize the program
await program.methods
  .initialize(
    new anchor.BN(5),  // Scooter reward rate: 5 tokens per meter
    new anchor.BN(10), // Bike reward rate: 10 tokens per meter
    new anchor.BN(8)   // Electric bike reward rate: 8 tokens per meter
  )
  .accounts({
    stateAccount: stateAccount.publicKey,
    owner: wallet.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .signers([stateAccount])
  .rpc();

// Update a reward rate
await program.methods
  .updateValueScooterRewardRate(new anchor.BN(7)) // New rate: 7 tokens per meter
  .accounts({
    stateAccount: stateAccount.publicKey,
    owner: wallet.publicKey,
  })
  .rpc();

// Mint tokens for a ride
const transactionId = crypto.randomBytes(32); // Generate a unique transaction ID
const meters = new anchor.BN(100); // 100 meters traveled

await program.rpc.mintTokens(
  "bike",                     // Vehicle type
  meters,                     // Distance in meters 
  Array.from(transactionId),  // Transaction ID to prevent double counting
  {
    accounts: {
      stateAccount: stateAccount.publicKey,
      mint: cyclebackMint.publicKey,
      tokenAccount: userTokenAccount,
      owner: wallet.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
    }
  }
);
```

## Bloom Filter Implementation

The program uses a bloom filter to efficiently check if a transaction ID has been processed before:

- Space-efficient probabilistic data structure (512 bits)
- Guarantees no false negatives (will never miss a duplicate ID)
- Fast constant-time lookups and additions
- Low memory footprint on-chain

## Deployment

The program is deployed on Solana with the following addresses:

- Devnet: `7o67cgqG8dZRBEw8zqb8m6aG2FHRpQShTTskGGs59FrU` 