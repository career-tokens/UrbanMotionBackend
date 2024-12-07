import express from "express";
import carControllers, { deleteCarByRegistrationNumber, getAvailableCars, getCarDetailsByRegistrationNumber } from "../controllers/carControllers";

const carRouter = express.Router();

carRouter.post("/add-car", carControllers.addCar);
carRouter.get("/get-available-cars", carControllers.getAvailableCars);
carRouter.post("/book-car", carControllers.bookCar);
carRouter.post("/return-car", carControllers.returnCar);
carRouter.get("/all-cars", getAvailableCars);
carRouter.get("/car", getCarDetailsByRegistrationNumber);
carRouter.delete("/delete-car", deleteCarByRegistrationNumber);

export default carRouter;
