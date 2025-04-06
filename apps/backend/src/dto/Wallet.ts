import mongoose, {Document, Schema} from "mongoose";

interface IWallet extends Document {
    phone: string;
    wallet: string;
    token: string;
    trips: number;
}

const WalletSchema: Schema = new Schema({
    phone: {type: String, required: true},
    wallet: {type: String, required: true},
    token: {type: String, required: false},
    trips: {type: Number, required: false}
});

const Wallet = mongoose.model<IWallet>('Wallet', WalletSchema);

export {type IWallet, Wallet};
