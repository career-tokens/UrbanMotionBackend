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
exports.viewAllCars = exports.returnCar = exports.bookCar = exports.getAvailableCars = exports.addCar = void 0;
const Car_1 = __importDefault(require("../models/Car"));
/**
 * Add a new car
 * POST /add-car
 */
const addCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { registrationNumber, owner, model, carType, carPricing, } = req.body;
    try {
        const existingCar = yield Car_1.default.findOne({ registrationNumber });
        if (existingCar) {
            return res.status(400).json({ message: "Car with this registration number already exists" });
        }
        const newCar = yield Car_1.default.create({
            registrationNumber,
            owner,
            model,
            carType,
            carPricing,
        });
        return res.status(201).json({ message: "Car added successfully", car: newCar });
    }
    catch (err) {
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
 * GET /view-all-cars
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
exports.default = {
    addCar: exports.addCar,
    getAvailableCars: exports.getAvailableCars,
    bookCar: exports.bookCar,
    returnCar: exports.returnCar,
    viewAllCars: exports.viewAllCars
};
