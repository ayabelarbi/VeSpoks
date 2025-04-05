import mongoose, {Document, Schema} from "mongoose";

interface IPhone extends Document {
    // https://en.wikipedia.org/wiki/International_mobile_subscriber_identity
    imsi: string;
}

const PhoneSchema: Schema = new Schema({
    imsi: {type: String, required: true}
});

const Phone = mongoose.model<IPhone>('Phone', PhoneSchema);

export { IPhone, Phone};
