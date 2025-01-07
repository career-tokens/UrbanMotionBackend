import { Request, Response } from "express";
import  Retailer  from "../models/Retailer";
import { Session } from "../models/Session";
import { z } from "zod";
import sendEmail from "../utils/sendMail";
import bcrypt from "bcrypt";

// Define Zod schema for retailer validation
const addRetailerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  verificationType: z.enum(["aadhar", "pan"]),
  verificationId: z.string().min(1, "Verification ID is required"),
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

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create a new retailer with hashed password
    const retailer = await Retailer.create({
      ...validatedData,
      password: hashedPassword,
    });

    // Send a verification email
    const verificationLink = `${process.env.BACKEND_URL}/api/verify/verify-retailer?id=${retailer._id}`;
    const emailSubject = "Verify Your Email - Retailer Registration";
    const emailHtml = `
      <p>Hello ${retailer.name},</p>
      <p>Thank you for registering as a retailer. Please verify your email to complete the registration process.</p>
      <p>If this wasn't you, you can ignore this email.</p>
      <a href="${verificationLink}" style="padding: 10px 15px; color: #fff; background-color: #007bff; text-decoration: none;">Verify Email</a>
    `;

    await sendEmail(retailer.email, emailSubject, emailHtml);

    // Respond with success
    res.status(201).json({ message: "Verification link has been sent successfully!" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors.map((err) => ({ path: err.path, message: err.message })),
      });
    }
    return res.status(500).json({ message: "Error adding retailer", error });
  }
};

export const verifyRetailer = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if an account with the provided email exists
    const retailer = await Retailer.findOne({ email });
    if (!retailer) {
      return res.status(404).json({
        message: "No account found with this email. Please sign up.",
      });
    }

    // Check if the email is not verified
    if (!retailer.isVerified) {
      const verificationUrl = `${process.env.BACKEND_URL}/api/verify/verify-retailer?id=${retailer._id}`;
      const emailSubject = "Verify Your Account";
      const emailHtml = `
        <p>Hello ${retailer.name},</p>
        <p>It seems like your email has not been verified yet.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Verify Your Email</a>
      `;

      await sendEmail(retailer.email, emailSubject, emailHtml);

      return res.status(403).json({
        message: "Your email is not verified. A verification email has been sent.",
      });
    }

    // Compare the provided password with the hashed password
    const isPasswordCorrect = await bcrypt.compare(password, retailer.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    // If all checks pass, create a session
    const session = await Session.create({ data: retailer });
    return res.status(200).json({
      verified: true,
      sessionId: session._id,
      message: "Login successful.",
    });
  } catch (err) {
    console.error("Error verifying retailer:", err);
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
  

export const updateRetailerByEmail = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      email,
      name,
      password,
      verificationType,
      verificationId,
    }: {
      email: string;
      name?: string;
      password?: string;
      verificationType?: "aadhar" | "pan";
      verificationId?: string;
    } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required to update retailer." });
    }

    // Prepare the fields to update explicitly
    const updateFields: Partial<{
      name: string;
      password: string;
      verificationType: "aadhar" | "pan";
      verificationId: string;
    }> = {};

    if (name) updateFields.name = name;

    // Hash the new password if provided
    if (password) {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    if (verificationType) updateFields.verificationType = verificationType;
    if (verificationId) updateFields.verificationId = verificationId;

    // Find and update the retailer by email
    const updatedRetailer = await Retailer.findOneAndUpdate(
      { email },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedRetailer) {
      return res.status(404).json({ message: "Retailer not found." });
    }

    return res.status(200).json({ message: "Retailer updated successfully.", retailer: updatedRetailer });
  } catch (error) {
    console.error("Error updating retailer:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
