"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRetailerByEmail = exports.getAllRetailers = exports.verifyRetailer = exports.addRetailer = void 0;
const Retailer_1 = __importDefault(require("../models/Retailer"));
const Session_1 = require("../models/Session");
const zod_1 = require("zod");
const sendMail_1 = __importDefault(require("../utils/sendMail"));
// Define Zod schema for retailer validation
const addRetailerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
    verificationType: zod_1.z.enum(["aadhar", "pan"]),
    verificationId: zod_1.z.string().min(1, "Verification ID is required"),
});
const addRetailer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body using Zod schema
        const validatedData = addRetailerSchema.parse(req.body);
        // Check if a retailer with the given email already exists
        const existingRetailer = yield Retailer_1.default.findOne({ email: validatedData.email });
        if (existingRetailer) {
            return res.status(400).json({ message: "Retailer already exists" });
        }
        // Create a new retailer
        const retailer = yield Retailer_1.default.create(validatedData);
        // Send a verification email
        const verificationLink = `${process.env.BACKEND_URL}/api/verify/verify-retailer?id=${retailer._id}`;
        const emailSubject = "Verify Your Email - Retailer Registration";
        const emailHtml = `
      <p>Hello ${retailer.name},</p>
      <p>Thank you for registering as a retailer. Please verify your email to complete the registration process.</p>
      <p>If this wasn't you, you can ignore this email.</p>
      <a href="${verificationLink}" style="padding: 10px 15px; color: #fff; background-color: #007bff; text-decoration: none;">Verify Email</a>
    `;
        yield (0, sendMail_1.default)(retailer.email, emailSubject, emailHtml);
        // Respond with success
        res.status(201).json({ message: "Verification link has been sent successfully!" });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            // Handle Zod validation errors
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors.map((err) => ({ path: err.path, message: err.message })),
            });
        }
        // Handle other errors
        return res.status(500).json({ message: "Error adding retailer", error });
    }
});
exports.addRetailer = addRetailer;
const verifyRetailer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Check if an account with the provided email exists
        const retailer = yield Retailer_1.default.findOne({ email });
        if (!retailer) {
            return res
                .status(404)
                .json({ message: "No account found with this email. Please sign up." });
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
            yield (0, sendMail_1.default)(retailer.email, emailSubject, emailHtml);
            return res.status(403).json({
                message: "Your email is not verified. A verification email has been sent.",
            });
        }
        // Check if the password is incorrect
        if (retailer.password !== password) {
            return res.status(401).json({ message: "Incorrect password." });
        }
        // If all checks pass, create a session
        const session = yield Session_1.Session.create({ data: retailer });
        return res
            .status(200)
            .json({ verified: true, sessionId: session._id, message: "Login successful." });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err });
    }
});
exports.verifyRetailer = verifyRetailer;
const getAllRetailers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const retailers = yield Retailer_1.default.find({});
        return res.status(200).json({ retailers });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err });
    }
});
exports.getAllRetailers = getAllRetailers;
const updateRetailerByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, password, verificationType, verificationId } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required to update retailer." });
        }
        // Prepare the fields to update explicitly
        const updateFields = {};
        if (name)
            updateFields.name = name;
        if (password)
            updateFields.password = password;
        if (verificationType)
            updateFields.verificationType = verificationType;
        if (verificationId)
            updateFields.verificationId = verificationId;
        // Find and update the retailer by email
        const updatedRetailer = yield Retailer_1.default.findOneAndUpdate({ email }, { $set: updateFields }, { new: true, runValidators: true } // Return the updated document
        );
        if (!updatedRetailer) {
            return res.status(404).json({ message: "Retailer not found." });
        }
        return res.status(200).json({ message: "Retailer updated successfully.", retailer: updatedRetailer });
    }
    catch (error) {
        console.error("Error updating retailer:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});
exports.updateRetailerByEmail = updateRetailerByEmail;
