# VeMob Project

This project is a comprehensive solution for e-mobility services, including e-scooters, bikes, and e-bikes. It consists of a Solana smart contract, a backend REST API, and a frontend application.

## Project Structure

- **Solana Program**: Handles blockchain operations for rewards and transactions.
- **Backend (REST API)**: Built with Node.js, Express, and MongoDB, it provides endpoints for user authentication, reward minting, and more.
- **Frontend**: A user interface for interacting with the e-mobility services.

## Features

- User authentication and verification
- Reward minting for completed trips
- Integration with Solana blockchain for secure transactions
- MongoDB for data storage
- User-friendly frontend interface

## Prerequisites

- Node.js (version 14 or later)
- MongoDB (running locally or accessible remotely)
- Solana CLI and a valid keypair

## Setup

### Solana Smart Contract

1. **Navigate to the Solana directory:**

   ```bash
   cd solana
   ```

2. **Build and deploy the smart contract:**

   Follow the instructions in the `solana/README.md` for building and deploying the contract.

### Backend

1. **Navigate to the backend directory:**

   ```bash
   cd apps/backend
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Environment Variables:**

   Create a `.env` file in the `apps/backend` directory with the following variables:

   ```plaintext
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/vemob
   SECRET_KEY=<your-solana-secret-key>
   TOKEN_ADDRESS=<your-token-address>
   ```

4. **Start the MongoDB server:**

   Ensure MongoDB is running on your local machine or accessible remotely.

5. **Run the application:**

   ```bash
   yarn dev
   ```

   The server will start on `http://localhost:3000`.

### Frontend

1. **Navigate to the frontend directory:**

   ```bash
   cd apps/frontend
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Run the frontend application:**

   ```bash
   yarn start
   ```

   The frontend will start on `http://localhost:3001`.

## API Endpoints

- **GET /**: Health check endpoint
- **POST /api/v1/signin**: Sign in a user
- **POST /api/v1/login**: Log in a user
- **POST /api/v1/login/verify**: Verify user login
- **POST /api/v1/claim**: Claim rewards for completed trips
- **DELETE /api/v1/db**: Reset the database (for development purposes)

## Solana Integration

The application uses the Solana blockchain to mint rewards for users. Ensure you have a valid Solana keypair and the Solana CLI installed.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.