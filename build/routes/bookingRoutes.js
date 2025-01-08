"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingControllers_1 = require("../controllers/bookingControllers");
const router = express_1.default.Router();
// Route to get bookings by customer ID
router.get("/customer", bookingControllers_1.getBookingsByCustomerId);
// Route to get bookings by retailer ID
router.get("/retailer", bookingControllers_1.getBookingsByRetailerId);
exports.default = router;
