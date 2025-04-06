# Cycleback Rewards System

This system allows for managing rewards and parameters for different types of rides (bikes, e-bikes, and e-scooters) on the Solana blockchain.

To see an example use of the transactions in NodeJS, see `./examples/rewardsExample.ts`

## Setup

First, install the required dependencies:

```bash
npm install @solana/web3.js @coral-xyz/anchor @solana-developers/helpers
```

## Environment Variables

Create a `.env` file with the following variables:

```env
SECRET_KEY=["your","private","key","array"]
TOKEN_ADDRESS="your_token_address"
```

## Usage Examples

### 1. Initializing the Rewards System

```typescript
import { PublicKey } from "@solana/web3.js";
import { Rewards } from "./src/rewards";

// Initialize the rewards system
const rewards = new Rewards({
  tokenKey: new PublicKey("YOUR_TOKEN_ADDRESS"),
  daoKey: new PublicKey("YOUR_DAO_ADDRESS"),
  network: "devnet" // or "mainnet-beta" or "testnet"
});

// Connect to the network
await rewards.connect("devnet");
```

### 2. Updating Ride Parameters

```typescript
// Update bike rewards rate (e.g., 5 tokens per kilometer)
const bikeTx = await rewards.updateBikeRate(5);
console.log("Bike rate update transaction:", bikeTx);

// Update e-bike rewards rate
const ebikeTx = await rewards.updateEBikeRate(7);
console.log("E-bike rate update transaction:", ebikeTx);

// Update e-scooter rewards rate
const escooterTx = await rewards.updateEScooterRate(6);
console.log("E-scooter rate update transaction:", escooterTx);
```

### 3. Minting Rewards

```typescript
// Mint rewards for a ride
const mintTx = await rewards.mintRewards({
  account: new PublicKey("RECIPIENT_ADDRESS"),
  quantity: 10, // kilometers traveled
  rideType: "bike" // or "ebike" or "escooter"
});
console.log("Mint transaction:", mintTx);
```

## Transaction Details

### Update Ride Parameters

The system supports updating parameters for three types of rides:

1. **Bikes**: `updateBikeRate(value)`
   - Updates the reward rate for regular bikes
   - Value represents tokens per kilometer

2. **E-Bikes**: `updateEBikeRate(value)`
   - Updates the reward rate for electric bikes
   - Value represents tokens per kilometer

3. **E-Scooters**: `updateEScooterRate(value)`
   - Updates the reward rate for electric scooters
   - Value represents tokens per kilometer

Each update transaction:
- Requires a connection to the Solana network
- Uses the DAO key for authorization
- Returns a transaction hash upon success

### Minting Rewards

The `mintRewards` function:
- Takes a recipient address
- Specifies the ride type and distance
- Mints the appropriate number of tokens based on the current rates
- Returns a transaction hash upon success

## Error Handling

All functions include error handling for:
- Uninitialized connections
- Invalid parameters
- Transaction failures

Example error handling:

```typescript
try {
  const tx = await rewards.updateBikeRate(5);
  console.log("Success:", tx);
} catch (error) {
  console.error("Error updating bike rate:", error);
}
```

## Security Considerations

1. Always store private keys securely
2. Use environment variables for sensitive data
3. Validate all input parameters
4. Handle network errors appropriately

## Network Support

The system supports:
- Devnet (for testing)
- Testnet (for staging)
- Mainnet-beta (for production)

Choose the appropriate network when initializing the connection. 