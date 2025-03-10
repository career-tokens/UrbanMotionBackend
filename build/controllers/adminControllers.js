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
exports.updateAdminByEmail = exports.getAllAdmins = exports.verifyAdmin = exports.addAdmin = void 0;
const Admin_1 = __importDefault(require("../models/Admin"));
const Session_1 = require("../models/Session");
const zod_1 = require("zod");
const addAdminSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
    position: zod_1.z.string().min(1, "Position is required"),
    passcode: zod_1.z.string().min(1, "Passcode is required"),
});
const bcrypt_1 = __importDefault(require("bcrypt"));
const addAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body using Zod schema
        const validatedData = addAdminSchema.parse(req.body);
        // Check if the passcode matches
        if (validatedData.passcode !== process.env.ADMIN_PASSCODE) {
            return res.status(403).json({ message: "Invalid passcode" });
        }
        // Check if an admin with the given email already exists
        const existingAdmin = yield Admin_1.default.findOne({ email: validatedData.email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(validatedData.password, 10);
        // Create a new admin
        const { name, email, position } = validatedData;
        const admin = yield Admin_1.default.create({ name, email, password: hashedPassword, position });
        res.status(201).json(admin);
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
        res.status(500).json({ message: "Error adding admin", error });
    }
});
exports.addAdmin = addAdmin;
const verifyAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const admin = yield Admin_1.default.findOne({ email });
        if (!admin) {
            return res.status(401).json({ verified: false, message: "Invalid credentials" });
        }
        // Compare the provided password with the hashed password
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, admin.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ verified: false, message: "Invalid credentials" });
        }
        // Create a session
        const session = yield Session_1.Session.create({ data: admin });
        return res.status(200).json({ verified: true, sessionId: session._id });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err });
    }
});
exports.verifyAdmin = verifyAdmin;
const getAllAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admins = yield Admin_1.default.find({});
        return res.status(200).json(admins);
    }
    catch (error) {
        return res.status(500).json({ message: "Error retrieving admins", error });
    }
});
exports.getAllAdmins = getAllAdmins;
const updateAdminByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, position, name, password } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required to update admin." });
        }
        // Prepare the fields to update explicitly
        const updateFields = {};
        if (position)
            updateFields.position = position;
        if (name)
            updateFields.name = name;
        if (password) {
            // Hash the new password before updating
            updateFields.password = yield bcrypt_1.default.hash(password, 10);
        }
        // Find and update the admin by email
        const updatedAdmin = yield Admin_1.default.findOneAndUpdate({ email }, { $set: updateFields }, { new: true, runValidators: true } // Return the updated document
        );
        if (!updatedAdmin) {
            return res.status(404).json({ message: "Admin not found." });
        }
        return res.status(200).json({ message: "Admin updated successfully.", admin: updatedAdmin });
    }
    catch (error) {
        console.error("Error updating admin:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});
exports.updateAdminByEmail = updateAdminByEmail;
