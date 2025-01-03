import mongoose, { Schema, Document } from "mongoose";

interface ICustomer extends Document {
  name: string;
  carCurrentlyBookedId: mongoose.Types.ObjectId | null;
  email: string;
  plan: string | null;
  password: string;
  drivingLicenseId: string;
  verificationType: "aadhar" | "pan";
  verificationId: string;
  isVerified: boolean; 
}

const customerSchema = new Schema<ICustomer>({
  name: { type: String, required: true },
  carCurrentlyBookedId: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  plan:{type:String,default:null},
  drivingLicenseId: { type: String, required: true },
  verificationType: { type: String, enum: ["aadhar", "pan"], required: true },
  verificationId: { type: String, required: true },
  isVerified: { type: Boolean, default: false }, 
});

export default mongoose.model<ICustomer>("Customer", customerSchema);