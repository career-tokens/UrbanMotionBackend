import mongoose, { Schema } from "mongoose";

interface ICar extends Document {
  registrationNumber: string;
  owner: mongoose.Types.ObjectId;
  handedTo: mongoose.Types.ObjectId | null;
  handedOn: Date | null;
  model: string;
  carType: string;
  isHanded: boolean;
  durationGivenFor: string;
  rating: number;
  carPricing: {
    weekly: number;
    monthly: number;
    quarterly: number;
  };
}

const carSchema = new Schema<ICar>({
  registrationNumber: { type: String, required: true, unique: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Retailer", required: true },
  handedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", default: null },
  handedOn: { type: Date, default: null },
  model: { type: String, required: true },
  carType: { type: String, required: true },
  isHanded: { type: Boolean, default: false },
  durationGivenFor: { type: String,default:null },
  rating: { type: Number, default: 0 },
  carPricing: {
    weekly: { type: Number, required: true },
    monthly: { type: Number, required: true },
    quarterly: { type: Number, required: true },
  },
});

export default mongoose.model<ICar>("Car", carSchema);