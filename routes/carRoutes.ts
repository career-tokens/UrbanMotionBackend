import express from "express";
import carControllers, {deleteCarByRegistrationNumber, getAvailableCars, getCarDetailsByRegistrationNumber, viewAllCars } from "../controllers/carControllers";

const carRouter = express.Router();

carRouter.post("/add-car", carControllers.addCar);
carRouter.get("/get-available-cars", carControllers.getAvailableCars);
carRouter.post("/book-car", carControllers.bookCar);
carRouter.post("/return-car", carControllers.returnCar);
carRouter.get("/all-cars", viewAllCars);
carRouter.get("/car", getCarDetailsByRegistrationNumber);
carRouter.delete("/delete-car", deleteCarByRegistrationNumber);
carRouter.patch('/update-car/:registrationNumber', carControllers.updateCarDetails);

export default carRouter;
