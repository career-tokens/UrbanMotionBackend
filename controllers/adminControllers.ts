import { Request, Response } from "express";
import Admin from "../models/Admin";
import { Session } from "../models/Session";
import { z } from "zod";

const addAdminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  position: z.string().min(1, "Position is required"),
  passcode: z.string().min(1, "Passcode is required"),
});

export const addAdmin = async (req: Request, res: Response) => {
  try {
    // Validate request body using Zod schema
    const validatedData = addAdminSchema.parse(req.body);

    // Check if the passcode matches
    if (validatedData.passcode !== process.env.ADMIN_PASSCODE) {
      return res.status(403).json({ message: "Invalid passcode" });
    }

    // Check if an admin with the given email already exists
    const existingAdmin = await Admin.findOne({ email: validatedData.email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Create a new admin
    const { name, email, password, position } = validatedData;
    const admin = await Admin.create({ name, email, password, position });
    res.status(201).json(admin);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors.map((err) => ({ path: err.path, message: err.message })),
      });
    }

    // Handle other errors
    res.status(500).json({ message: "Error adding admin", error });
  }
};

export const verifyAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email, password });
    if (!admin) {
      return res.status(401).json({ verified: false, message: "Invalid credentials" });
    }

    // Create a session
    const session = await Session.create({ data: admin });
    return res.status(200).json({ verified: true, sessionId: session._id });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err });
  }
};

export const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await Admin.find({});
    return res.status(200).json(admins);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving admins", error });
  }
};