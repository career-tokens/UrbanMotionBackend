import { Request, Response } from "express";
import  Retailer  from "../models/Retailer";
import { Session } from "../models/Session";
import { z } from "zod";

// Define Zod schema for retailer validation
const addRetailerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  otherDetails: z.record(z.string()).optional(), // Optional object for additional retailer details
});

export const addRetailer = async (req: Request, res: Response) => {
  try {
    // Validate request body using Zod schema
    const validatedData = addRetailerSchema.parse(req.body);

    // Check if a retailer with the given email already exists
    const existingRetailer = await Retailer.findOne({ email: validatedData.email });
    if (existingRetailer) {
      return res.status(400).json({ message: "Retailer already exists" });
    }

    // Create a new retailer
    const { name, email, password, otherDetails } = validatedData;
    const newRetailer = await Retailer.create({ name, email, password, ...otherDetails });

    return res.status(201).json({
      message: "Retailer added successfully",
      retailer: newRetailer,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors.map((err) => ({ path: err.path, message: err.message })),
      });
    }

    // Handle other errors
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const verifyRetailer = async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    try {
      const retailer = await Retailer.findOne({ email, password });
      if (!retailer) {
        return res.status(401).json({ verified: false, message: "Invalid credentials" });
      }
  
      // Create a session
      const session = await Session.create({ data: retailer });
      return res.status(200).json({ verified: true, sessionId: session._id });
    } catch (err) {
      return res.status(500).json({ message: "Internal server error", error: err });
    }
  };

  export const getAllRetailers = async (req: Request, res: Response) => {
    try {
      const retailers = await Retailer.find({});
      return res.status(200).json({ retailers });
    } catch (err) {
      return res.status(500).json({ message: "Internal server error", error: err });
    }
  };