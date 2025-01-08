import Booking from "../models/Booking";
import { Request, Response } from "express";

export const getBookingsByCustomerId = async (req: Request, res: Response) => {
  const { customerId } = req.query;

  try {
    const bookings = await Booking.find({ customerId })


    return res.status(200).json({ bookings });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err });
  }
};


export const getBookingsByRetailerId = async (req: Request, res: Response) => {
    const { retailerId } = req.query;
  
    try {
      const bookings = await Booking.find({ retailerId })
  
      return res.status(200).json({ bookings });
    } catch (err) {
      return res.status(500).json({ message: "Internal server error", error: err });
    }
  };
  