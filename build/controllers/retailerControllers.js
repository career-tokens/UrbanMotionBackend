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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRetailers = exports.verifyRetailer = exports.addRetailer = void 0;
const Retailer_1 = __importDefault(require("../models/Retailer"));
const Session_1 = require("../models/Session");
const addRetailer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { name, email, password } = _a, otherDetails = __rest(_a, ["name", "email", "password"]);
    try {
        const existingRetailer = yield Retailer_1.default.findOne({ email });
        if (existingRetailer) {
            return res.status(400).json({ message: "Retailer already exists" });
        }
        const newRetailer = yield Retailer_1.default.create(Object.assign({ name, email, password }, otherDetails));
        return res.status(201).json({ message: "Retailer added successfully", retailer: newRetailer });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err });
    }
});
exports.addRetailer = addRetailer;
const verifyRetailer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const retailer = yield Retailer_1.default.findOne({ email, password });
        if (!retailer) {
            return res.status(401).json({ verified: false, message: "Invalid credentials" });
        }
        // Create a session
        const session = yield Session_1.Session.create({ data: retailer });
        return res.status(200).json({ verified: true, sessionId: session._id });
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
