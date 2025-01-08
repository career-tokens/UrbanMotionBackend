//@ts-nocheck
import { Request, Response } from "express";
import Car from "../models/Car";
import Customer from "../models/Customer";
import Retailer from "../models/Retailer";

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
    // Check if the car already exists
    const existingCar = await Car.findOne({ registrationNumber });
    if (existingCar) {
      return res.status(400).json({ message: "Car with this registration number already exists" });
    }

    // Create the car
    const newCar = await Car.create({
      registrationNumber,
      owner,
      model,
      carType,
      carPricing,
      carImage: carImage || null, // Set to null if not provided
    });

    // Update the owner's carsSubmittedIdArray
    await Retailer.findByIdAndUpdate(
      owner,
      { $push: { carsSubmittedIdArray: newCar._id } },
      { new: true }
    );

    return res.status(201).json({ message: "Car added successfully", car: newCar });
  } catch (err) {
    console.error("Error adding car:", err);
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
import Car from "../models/Car";
import Customer from "../models/Customer";
import Retailer from "../models/Retailer";
import Booking from "../models/Booking";
import { Request, Response } from "express";

export const returnCar = async (req: Request, res: Response) => {
  const { registrationNumber, rating, price } = req.body; // Include price in the request body

  try {
    // Find the car that's currently handed out
    const car = await Car.findOne({ registrationNumber, isHanded: true });
    if (!car) {
      return res.status(404).json({ message: "Car is not currently handed out" });
    }

    // Find the customer who rented the car
    const customer = await Customer.findById(car.handedTo);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Find the retailer who owns the car
    const retailer = await Retailer.findById(car.owner);
    if (!retailer) {
      return res.status(404).json({ message: "Retailer not found" });
    }

    // Create a new booking record for the returned car
    const booking = new Booking({
      registrationNumber: car.registrationNumber,
      carModel: car.model, // Using carModel as per previous implementation
      startDate: car.handedOn,
      endDate: new Date(),
      customerId: customer._id,
      price: price, // Use the price from the request body
      retailerId: retailer._id,
    });
    await booking.save();

    // Update the customer's car booking status
    customer.carCurrentlyBookedId = null;
    await customer.save();

    // Update the car's status
    car.isHanded = false;
    car.handedTo = null;
    car.handedOn = null;
    car.durationGivenFor = "";
    if (rating !== undefined && rating > 0) {
      car.rating = (car.rating + rating) / 2; // Update the car's rating
    }
    await car.save();

    return res.status(200).json({
      message: "Car returned successfully",
      car,
      booking,
    });
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
    // Find and delete the car
    const car = await Car.findOneAndDelete({ registrationNumber });

    if (!car) {
      return res.status(404).json({
        message: "Car with this registration number does not exist",
      });
    }

    // Update the owner's carsSubmittedIdArray
    await Retailer.findByIdAndUpdate(
      car.owner,
      { $pull: { carsSubmittedIdArray: car._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Car deleted successfully",
      deletedCar: car,
    });
  } catch (error: any) {
    console.error("Error deleting car:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the car",
      error: error.message,
    });
  }
};

//update car
const updateCarDetails = async (req: Request, res: Response) => {
  try {
    const { registrationNumber } = req.params;
    const { model, carType, carImage, carPricing } = req.body;

    // Find the car by registration number and update the allowed fields
    const updatedCar = await Car.findOneAndUpdate(
      { registrationNumber },
      {
        $set: {
          model,
          carType,
          carImage,
          carPricing
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedCar) {
      return res.status(404).json({
        message: "Car with this registration number does not exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Car details updated successfully",
      updatedCar,
    });
  } catch (error: any) {
    console.error("Error updating car details:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the car details",
      error: error.message,
    });
  }
};


export default {
  addCar,
  getAvailableCars,
  bookCar,
  returnCar,
  viewAllCars,
  updateCarDetails
};
