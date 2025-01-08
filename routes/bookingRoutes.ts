import express from "express";
import { getBookingsByCustomerId, getBookingsByRetailerId } from "../controllers/bookingControllers";

const router = express.Router();

// Route to get bookings by customer ID
router.get("/customer", getBookingsByCustomerId);

// Route to get bookings by retailer ID
router.get("/retailer", getBookingsByRetailerId);

export default router;
