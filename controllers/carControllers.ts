import { Request, Response } from "express";
import Car from "../models/Car";
import Customer from "../models/Customer";

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
    carImage, // Optional field for car image
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
      carImage: carImage || null, // Set to null if not provided
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
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    customer.carCurrentlyBookedId = registrationNumber;
    await customer.save();
    

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
    
    const customer = await Customer.findById(car.handedTo);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    customer.carCurrentlyBookedId = null;
    await customer.save();

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
 * GET /all-cars
 */
export const viewAllCars = async (req: Request, res: Response) => {
  try {
    const cars = await Car.find().populate("owner", "name email");
    return res.status(200).json({ cars });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err });
  }
};

//GET car details
export const getCarDetailsByRegistrationNumber = async (req: Request, res: Response) => {
  const { registrationNumber } = req.query;

  try {
    // Find the car by registration number
    const car = await Car.findOne({ registrationNumber })
      .populate("owner", "name email") // Populate owner details (adjust fields as per your Retailer schema)
      .populate("handedTo", "name email"); // Populate handedTo details (adjust fields as per your Customer schema)

    if (!car) {
      return res.status(404).json({
        message: "Car not found",
      });
    }

    // Send the car details in response
    res.status(200).json({
      success: true,
      data: car,
    });
  } catch (error:any) {
    console.error("Error fetching car details:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching car details",
      error: error.message,
    });
  }
};

//delete car
export const deleteCarByRegistrationNumber = async (req: Request, res: Response) => {
  const { registrationNumber } = req.query;

  try {
    const car = await Car.findOneAndDelete({ registrationNumber });

    if (!car) {
      return res.status(404).json({
        message: "Car with this registration number does not exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Car deleted successfully",
      deletedCar: car,
    });
  } catch (error:any) {
    console.error("Error deleting car:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the car",
      error: error.message,
    });
  }
};


export default {
  addCar,
  getAvailableCars,
  bookCar,
  returnCar,
  viewAllCars
};
