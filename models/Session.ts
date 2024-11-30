import mongoose, { Schema, Document } from "mongoose";

interface SessionDocument extends Document {
  data: object; // Can store customer or retailer object
  createdAt: Date;
}

const SessionSchema = new Schema<SessionDocument>(
  {
    data: { type: Object, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Session = mongoose.model<SessionDocument>("Session", SessionSchema);
