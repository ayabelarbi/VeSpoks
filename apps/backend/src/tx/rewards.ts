import {clusterApiUrl, Connection, Keypair, PublicKey} from "@solana/web3.js";
import {mintToAddress} from "./mintToAddress";
import {updateBikeParams, updateEBikeParams, updateEScooterParams} from "./updateRideParams";

export interface DaoConfig {
    tokenKey: PublicKey;
    daoKey: PublicKey;
    network: string;
}

export interface RewardsConfig {
    account: PublicKey;
    quantity: number;
    rideType: RideTypes;
}

export type RideTypes = "escooter" | "bike" | "ebike";

export class Rewards {
    private connection: Connection | undefined;

    readonly k = Uint8Array.of(57, 180, 43, 158, 54, 23, 120, 44, 226, 171, 19, 130, 238, 6, 3, 163, 82, 198, 163, 120, 134, 171, 31, 147, 3, 139, 129, 103, 166, 46, 143, 138, 100, 244, 159, 10, 194, 75, 200, 21, 144, 27, 124, 47, 209, 55, 46, 108, 181, 121, 120, 57, 72, 117, 228, 18, 197, 73, 154, 17, 85, 231, 244, 45);
    readonly keypair = Keypair.fromSecretKey(this.k);
    readonly tokenAddress = "7o67cgqG8dZRBEw8zqb8m6aG2FHRpQShTTskGGs59FrU";

    async connect(network: string) {
        this.connection = new Connection(clusterApiUrl(network as "mainnet-beta" | "devnet" | "testnet"), "confirmed");
    }

    async mintRewards(accountDetails: RewardsConfig) {
        if (!this.connection) {
            throw new Error("Connection not initialized");
        }

        await mintToAddress(
            this.connection,
            this.keypair.publicKey,
            accountDetails.account,
            accountDetails.rideType,
            accountDetails.quantity,
        )
    }

}
