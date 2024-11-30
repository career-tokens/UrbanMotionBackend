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
exports.getAllAdmins = exports.verifyAdmin = exports.addAdmin = void 0;
const Admin_1 = __importDefault(require("../models/Admin"));
const Session_1 = require("../models/Session");
const addAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, position, passcode } = req.body;
        // Check if the passcode matches
        if (passcode !== process.env.ADMIN_PASSCODE) {
            return res.status(403).json({ message: "Invalid passcode" });
        }
        const existingAdmin = yield Admin_1.default.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }
        const admin = yield Admin_1.default.create({ name, email, password, position });
        res.status(201).json(admin);
    }
    catch (error) {
        res.status(500).json({ message: "Error adding admin", error });
    }
});
exports.addAdmin = addAdmin;
const verifyAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const admin = yield Admin_1.default.findOne({ email, password });
        if (!admin) {
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
