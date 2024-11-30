import mongoose, { Schema } from "mongoose";

interface IAdmin extends Document {
    position: string;
    name: string;
    email: string;
    password: string;
  }
  
  const adminSchema = new Schema<IAdmin>({
    position: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });
  
  export default mongoose.model<IAdmin>("Admin", adminSchema);
  