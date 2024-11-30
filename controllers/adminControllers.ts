import { Request, Response } from "express";
import Admin from "../models/Admin";
import { Session } from "../models/Session";

export const addAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password, position, passcode } = req.body;

    // Check if the passcode matches
    if (passcode !== process.env.ADMIN_PASSCODE) {
      return res.status(403).json({ message: "Invalid passcode" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({ name, email, password, position });
    res.status(201).json(admin);
  } catch (error) {
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