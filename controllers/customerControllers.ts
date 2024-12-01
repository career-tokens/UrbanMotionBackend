import { Request, Response } from "express";
import Customer from "../models/Customer";
import { Session } from "../models/Session";
import { z } from "zod";

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

    // Create a new customer
    const customer = await Customer.create(validatedData);
    res.status(201).json(customer);
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
      const customer = await Customer.findOne({ email, password });
      if (!customer) {
        return res.status(401).json({ verified: false, message: "Invalid credentials" });
      }
  
      // Create a session
      const session = await Session.create({ data: customer });
      return res.status(200).json({ verified: true, sessionId: session._id });
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