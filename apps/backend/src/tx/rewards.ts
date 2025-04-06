import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";
import { mintToAddress } from "./tx/mintToAddress";
import { updateBikeParams, updateEBikeParams, updateEScooterParams } from "./tx/updateRideParams";

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
  readonly config: DaoConfig;
  private connection: Connection | undefined;

  readonly keypair = getKeypairFromEnvironment("SECRET_KEY");
  readonly tokenAddress = process.env.TOKEN_ADDRESS
 
  constructor(daoConfig: DaoConfig) {
    this.config = daoConfig;
    this.connection = undefined;
  }

  async connect(network: string) {
    this.connection = new Connection(clusterApiUrl(network as "mainnet-beta" | "devnet" | "testnet"), "confirmed");
  }

  async mintRewards(accountDetails: RewardsConfig) {
    if (!this.connection) {
      throw new Error("Connection not initialized");
    }

    await mintToAddress(
      this.connection,
      this.config.tokenKey,
      accountDetails.account,
      accountDetails.rideType,
      accountDetails.quantity,
    )
  }

  async updateBikeRate(rideValue: number) {
    if (!this.connection) {
      throw new Error("Connection not initialized");
    }

    const txHash = await updateBikeParams(
      this.connection,
      this.config.daoKey,
      rideValue,
    )

    return txHash;
  }

  async updateEBikeRate(ebikeValue: number) {
    if (!this.connection) {
      throw new Error("Connection not initialized");
    }

    const txHash = await updateEBikeParams(
      this.connection,
      this.config.daoKey,
      ebikeValue,
    )

    return txHash;
  }

  async updateEScooterRate(escooterValue: number) {
    if (!this.connection) {
      throw new Error("Connection not initialized");
    }
    
    const txHash = await updateEScooterParams(
      this.connection,
      this.config.daoKey,
      escooterValue,
    )
    
    return txHash;
  }
}
