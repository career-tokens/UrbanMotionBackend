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
exports.getAllCustomers = exports.verifyCustomer = exports.addCustomer = void 0;
const Customer_1 = __importDefault(require("../models/Customer"));
const Session_1 = require("../models/Session");
const addCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const existingCustomer = yield Customer_1.default.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ message: "Customer already exists" });
        }
        const customer = yield Customer_1.default.create(req.body);
        res.status(201).json(customer);
    }
    catch (error) {
        res.status(500).json({ message: "Error adding customer", error });
    }
});
exports.addCustomer = addCustomer;
const verifyCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const customer = yield Customer_1.default.findOne({ email, password });
        if (!customer) {
            return res.status(401).json({ verified: false, message: "Invalid credentials" });
        }
        // Create a session
        const session = yield Session_1.Session.create({ data: customer });
        return res.status(200).json({ verified: true, sessionId: session._id });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err });
    }
});
exports.verifyCustomer = verifyCustomer;
const getAllCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield Customer_1.default.find();
        res.status(200).json(customers);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving customers", error });
    }
});
exports.getAllCustomers = getAllCustomers;
