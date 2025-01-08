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
exports.getBookingsByRetailerId = exports.getBookingsByCustomerId = void 0;
const Booking_1 = __importDefault(require("../models/Booking"));
const getBookingsByCustomerId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId } = req.query;
    try {
        const bookings = yield Booking_1.default.find({ customerId });
        return res.status(200).json({ bookings });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err });
    }
});
exports.getBookingsByCustomerId = getBookingsByCustomerId;
const getBookingsByRetailerId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { retailerId } = req.query;
    try {
        const bookings = yield Booking_1.default.find({ retailerId });
        return res.status(200).json({ bookings });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err });
    }
});
exports.getBookingsByRetailerId = getBookingsByRetailerId;
