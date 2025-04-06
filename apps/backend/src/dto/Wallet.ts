import mongoose, {Document, Schema} from "mongoose";

interface IWallet extends Document {
    phone: string;
    wallet: string;
    token: string;
}

const WalletSchema: Schema = new Schema({
    phone: {type: String, required: true},
    wallet: {type: String, required: true},
    token: {type: String, required: false}
});

const Wallet = mongoose.model<IWallet>('Wallet', WalletSchema);

export {IWallet, Wallet};
