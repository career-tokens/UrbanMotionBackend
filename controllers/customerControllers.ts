import { Request, Response } from "express";
import Customer from "../models/Customer";
import { Session } from "../models/Session";
import { z } from "zod";
import sendEmail from "../utils/sendMail";
import Car from "../models/Car";
import bcrypt from "bcrypt";

const addCustomerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  drivingLicenseId: z.string().min(1, "Driving license ID is required"),
  verificationType: z.enum(["aadhar", "pan"]).refine(
    (value) => ["aadhar", "pan"].includes(value),
    { message: "Invalid verification type" }
  ),
  verificationId: z.string().min(1, "Verification ID is required"),
});

export const addCustomer = async (req: Request, res: Response) => {
  try {
    // Validate request body using Zod schema
    const validatedData = addCustomerSchema.parse(req.body);

    // Check if a customer with the given email already exists
    const existingCustomer = await Customer.findOne({ email: validatedData.email });
    if (existingCustomer) {
      return res.status(400).json({ message: "Customer already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create a new customer with the hashed password
    const customer = await Customer.create({ ...validatedData, password: hashedPassword });

    // Send a verification email
    const verificationLink = `${process.env.BACKEND_URL}/api/verify/verify-customer?id=${customer._id}`;
    const emailSubject = "Verify Your Email - Customer Registration";
    const emailHtml = `
      <p>Hello ${customer.name},</p>
      <p>Thank you for registering. Please verify your email to complete the registration process.</p>
      <p>If this wasn't you, you can ignore this email.</p>
      <a href="${verificationLink}" style="padding: 10px 15px; color: #fff; background-color: #007bff; text-decoration: none;">Verify Email</a>
    `;

    await sendEmail(customer.email, emailSubject, emailHtml);

    // Respond with success
    res.status(201).json({ message: "Verification link has been sent successfully!" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors.map((err) => ({ path: err.path, message: err.message })),
      });
    }

    // Handle other errors
    res.status(500).json({ message: "Error adding customer", error });
  }
};


export const verifyCustomer = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if an account with the provided email exists
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res
        .status(404)
        .json({ message: "No account found with this email. Please sign up." });
    }

    // Check if the email is not verified
    if (!customer.isVerified) {
      const verificationUrl = `${process.env.BACKEND_URL}/api/verify/verify-customer?id=${customer._id}`;
      const emailSubject = "Verify Your Account";
      const emailHtml = `
        <p>Hello ${customer.name},</p>
        <p>It seems like your email has not been verified yet.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Verify Your Email</a>
      `;

      await sendEmail(customer.email, emailSubject, emailHtml);

      return res.status(403).json({
        message: "Your email is not verified. A verification email has been sent.",
      });
    }

    // Check if the password is incorrect
    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    // If all checks pass, create a session
    const session = await Session.create({ data: customer });
    return res
      .status(200)
      .json({ verified: true, sessionId: session._id, message: "Login successful." });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err });
  }
};


  export const getAllCustomers = async (req: Request, res: Response) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving customers", error });
    }
};



export const updateCustomerByEmail = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      email,
      name,
      password,
      drivingLicenseId,
      verificationType,
      verificationId,
    }: {
      email: string;
      name?: string;
      password?: string;
      drivingLicenseId?: string;
      verificationType?: "aadhar" | "pan";
      verificationId?: string;
    } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required to update customer." });
    }

    // Prepare the fields to update explicitly
    const updateFields: Partial<{
      name: string;
      password: string;
      drivingLicenseId: string;
      verificationType: "aadhar" | "pan";
      verificationId: string;
    }> = {};

    if (name) updateFields.name = name;
    if (password) updateFields.password = await bcrypt.hash(password, 10);
    if (drivingLicenseId) updateFields.drivingLicenseId = drivingLicenseId;
    if (verificationType) updateFields.verificationType = verificationType;
    if (verificationId) updateFields.verificationId = verificationId;

    // Find and update the customer by email
    const updatedCustomer = await Customer.findOneAndUpdate(
      { email },
      { $set: updateFields },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    return res.status(200).json({ message: "Customer updated successfully.", customer: updatedCustomer });
  } catch (error) {
    console.error("Error updating customer:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const updateCarAndCustomer = async (req: Request, res: Response): Promise<Response> => {
  const { registrationNumber, plan, durationGivenFor } = req.body;

  try {
    // Find the car by registration number
    const car = await Car.findOne({ registrationNumber });

    if (!car) {
      return res.status(404).json({ message: "Car not found." });
    }

    // Update the car fields
    car.durationGivenFor = durationGivenFor;

    // Save the updated car
    const updatedCar = await car.save();

    // Find the customer by carCurrentlyBookedId
    const customer = await Customer.findOne({ _id: car.handedTo });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    // Update the customer fields
    customer.plan = plan;

    // Save the updated customer
    const updatedCustomer = await customer.save();

    return res.status(200).json({
      message: "Car and Customer updated successfully.",
      car: updatedCar,
      customer: updatedCustomer
    });
  } catch (error) {
    console.error("Error updating car and customer:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};