import mongoose, { Schema } from "mongoose";

interface IRetailer extends Document {
    name: string;
    email: string;
    password: string;
    verificationType: "aadhar" | "pan";
    verificationId: string;
  carsSubmittedIdArray: mongoose.Types.ObjectId[];
  isVerified: boolean;
  }
  
  const retailerSchema = new Schema<IRetailer>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verificationType: { type: String, enum: ["aadhar", "pan"], required: true },
    verificationId: { type: String, required: true },
    carsSubmittedIdArray: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }],
    isVerified: { type: Boolean, default: false }, 
  });
  
  export default mongoose.model<IRetailer>("Retailer", retailerSchema);
  