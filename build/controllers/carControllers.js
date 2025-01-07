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
exports.deleteCarByRegistrationNumber = exports.getCarDetailsByRegistrationNumber = exports.viewAllCars = exports.returnCar = exports.bookCar = exports.getAvailableCars = exports.addCar = void 0;
const Car_1 = __importDefault(require("../models/Car"));
const Customer_1 = __importDefault(require("../models/Customer"));
const Retailer_1 = __importDefault(require("../models/Retailer"));
/**
 * Add a new car
 * POST /add-car
 */
const addCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { registrationNumber, owner, model, carType, carPricing, carImage, // Optional field for car image
     } = req.body;
    try {
        // Check if the car already exists
        const existingCar = yield Car_1.default.findOne({ registrationNumber });
        if (existingCar) {
            return res.status(400).json({ message: "Car with this registration number already exists" });
        }
        // Create the car
        const newCar = yield Car_1.default.create({
            registrationNumber,
            owner,
            model,
            carType,
            carPricing,
            carImage: carImage || null, // Set to null if not provided
        });
        // Update the owner's carsSubmittedIdArray
        yield Retailer_1.default.findByIdAndUpdate(owner, { $push: { carsSubmittedIdArray: newCar._id } }, { new: true });
        return res.status(201).json({ message: "Car added successfully", car: newCar });
    }
    catch (err) {
        console.error("Error adding car:", err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
});
exports.addCar = addCar;
/**
 * Get all available cars (cars that are not handed out)
 * GET /get-available-cars
 */
const getAvailableCars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const availableCars = yield Car_1.default.find({ isHanded: false }).populate("owner", "name email");
        return res.status(200).json({ cars: availableCars });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err });
    }
});
exports.getAvailableCars = getAvailableCars;
/**
 * Book a car
 * POST /book-car
 */
const bookCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { registrationNumber, customerId, durationGivenFor } = req.body;
    try {
        const car = yield Car_1.default.findOne({ registrationNumber, isHanded: false });
        if (!car) {
            return res.status(404).json({ message: "Car is not available for booking" });
        }
        car.isHanded = true;
        car.handedTo = customerId;
        car.handedOn = new Date();
        car.durationGivenFor = durationGivenFor;
        yield car.save();
        const customer = yield Customer_1.default.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        customer.carCurrentlyBookedId = registrationNumber;
        yield customer.save();
        return res.status(200).json({ message: "Car booked successfully", car });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err });
    }
});
exports.bookCar = bookCar;
/**
 * Return a car
 * POST /return-car
 */
const returnCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { registrationNumber, rating } = req.body;
    try {
        const car = yield Car_1.default.findOne({ registrationNumber, isHanded: true });
        if (!car) {
            return res.status(404).json({ message: "Car is not currently handed out" });
        }
        const customer = yield Customer_1.default.findById(car.handedTo);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        customer.carCurrentlyBookedId = null;
        yield customer.save();
        car.isHanded = false;
        car.handedTo = null;
        car.handedOn = null;
        car.durationGivenFor = "";
        if (rating !== undefined && rating > 0) {
            // Calculate the average rating
            car.rating = (car.rating + rating) / 2;
        }
        yield car.save();
        return res.status(200).json({ message: "Car returned successfully", car });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err });
    }
});
exports.returnCar = returnCar;
/**
 * View all cars
 * GET /all-cars
 */
const viewAllCars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cars = yield Car_1.default.find().populate("owner", "name email");
        return res.status(200).json({ cars });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err });
    }
});
exports.viewAllCars = viewAllCars;
//GET car details
const getCarDetailsByRegistrationNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { registrationNumber } = req.query;
    try {
        // Find the car by registration number
        const car = yield Car_1.default.findOne({ registrationNumber })
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
    }
    catch (error) {
        console.error("Error fetching car details:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching car details",
            error: error.message,
        });
    }
});
exports.getCarDetailsByRegistrationNumber = getCarDetailsByRegistrationNumber;
//delete car
const deleteCarByRegistrationNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { registrationNumber } = req.query;
    try {
        // Find and delete the car
        const car = yield Car_1.default.findOneAndDelete({ registrationNumber });
        if (!car) {
            return res.status(404).json({
                message: "Car with this registration number does not exist",
            });
        }
        // Update the owner's carsSubmittedIdArray
        yield Retailer_1.default.findByIdAndUpdate(car.owner, { $pull: { carsSubmittedIdArray: car._id } }, { new: true });
        return res.status(200).json({
            success: true,
            message: "Car deleted successfully",
            deletedCar: car,
        });
    }
    catch (error) {
        console.error("Error deleting car:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the car",
            error: error.message,
        });
    }
});
exports.deleteCarByRegistrationNumber = deleteCarByRegistrationNumber;
//update car
const updateCarDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { registrationNumber } = req.params;
        const { model, carType, carImage, carPricing } = req.body;
        // Find the car by registration number and update the allowed fields
        const updatedCar = yield Car_1.default.findOneAndUpdate({ registrationNumber }, {
            $set: {
                model,
                carType,
                carImage,
                carPricing
            }
        }, { new: true, runValidators: true });
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
    }
    catch (error) {
        console.error("Error updating car details:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the car details",
            error: error.message,
        });
    }
});
exports.default = {
    addCar: exports.addCar,
    getAvailableCars: exports.getAvailableCars,
    bookCar: exports.bookCar,
    returnCar: exports.returnCar,
    viewAllCars: exports.viewAllCars,
    updateCarDetails
};
