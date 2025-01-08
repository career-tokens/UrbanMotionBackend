import mongoose, { Schema, Document } from "mongoose";

interface IBooking extends Document {
  registrationNumber: string;
  carModel: string; 
  startDate: Date;
  endDate: Date;
  customerId: mongoose.Types.ObjectId;
  price: number;
  retailerId: mongoose.Types.ObjectId;
}

const bookingSchema = new Schema<IBooking>({
  registrationNumber: { type: String, required: true },
  carModel: { type: String, required: true }, // Renamed here as well
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  price: { type: Number, required: true },
  retailerId: { type: mongoose.Schema.Types.ObjectId, ref: "Retailer", required: true },
});

export default mongoose.model<IBooking>("Booking", bookingSchema);
