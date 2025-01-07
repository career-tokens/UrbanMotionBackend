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

import bcrypt from "bcrypt";

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

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create a new admin
    const { name, email, position } = validatedData;
    const admin = await Admin.create({ name, email, password: hashedPassword, position });
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
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ verified: false, message: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
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


export const updateAdminByEmail = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      email,
      position,
      name,
      password
    }: {
      email: string;
      position?: string;
      name?: string;
      password?: string;
    } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required to update admin." });
    }

    // Prepare the fields to update explicitly
    const updateFields: Partial<{
      position: string;
      name: string;
      password: string;
    }> = {};

    if (position) updateFields.position = position;
    if (name) updateFields.name = name;
    if (password) {
      // Hash the new password before updating
      updateFields.password = await bcrypt.hash(password, 10);
    }

    // Find and update the admin by email
    const updatedAdmin = await Admin.findOneAndUpdate(
      { email },
      { $set: updateFields },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    return res.status(200).json({ message: "Admin updated successfully.", admin: updatedAdmin });
  } catch (error) {
    console.error("Error updating admin:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};