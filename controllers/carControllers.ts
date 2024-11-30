import { Request, Response } from "express";
import Car from "../models/Car";

/**
 * Add a new car
 * POST /add-car
 */
export const addCar = async (req: Request, res: Response) => {
  const {
    registrationNumber,
    owner,
    model,
    carType,
    carPricing,
  } = req.body;

  try {
    const existingCar = await Car.findOne({ registrationNumber });
    if (existingCar) {
      return res.status(400).json({ message: "Car with this registration number already exists" });
    }

    const newCar = await Car.create({
      registrationNumber,
      owner,
      model,
      carType,
      carPricing,
    });

    return res.status(201).json({ message: "Car added successfully", car: newCar });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err });
  }
};

/**
 * Get all available cars (cars that are not handed out)
 * GET /get-available-cars
 */
export const getAvailableCars = async (req: Request, res: Response) => {
  try {
    const availableCars = await Car.find({ isHanded: false }).populate("owner", "name email");
    return res.status(200).json({ cars: availableCars });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err });
  }
};

/**
 * Book a car
 * POST /book-car
 */
export const bookCar = async (req: Request, res: Response) => {
  const { registrationNumber, customerId, durationGivenFor } = req.body;

  try {
    const car = await Car.findOne({ registrationNumber, isHanded: false });
    if (!car) {
      return res.status(404).json({ message: "Car is not available for booking" });
    }

    car.isHanded = true;
    car.handedTo = customerId;
    car.handedOn = new Date();
    car.durationGivenFor = durationGivenFor;
    await car.save();

    return res.status(200).json({ message: "Car booked successfully", car });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err });
  }
};

/**
 * Return a car
 * POST /return-car
 */
export const returnCar = async (req: Request, res: Response) => {
  const { registrationNumber, rating } = req.body;

  try {
    const car = await Car.findOne({ registrationNumber, isHanded: true });
    if (!car) {
      return res.status(404).json({ message: "Car is not currently handed out" });
    }

    car.isHanded = false;
    car.handedTo = null;
    car.handedOn = null;
    car.durationGivenFor = "";
    if (rating !== undefined && rating > 0) {
      // Calculate the average rating
      car.rating = (car.rating + rating) / 2;
    }
    await car.save();

    return res.status(200).json({ message: "Car returned successfully", car });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err });
  }
};


/**
 * View all cars
 * GET /view-all-cars
 */
export const viewAllCars = async (req: Request, res: Response) => {
  try {
    const cars = await Car.find().populate("owner", "name email");
    return res.status(200).json({ cars });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err });
  }
};

export default {
  addCar,
  getAvailableCars,
  bookCar,
  returnCar,
  viewAllCars
};
