import express from "express";
import carControllers, { getAvailableCars } from "../controllers/carControllers";

const carRouter = express.Router();

carRouter.post("/add-car", carControllers.addCar);
carRouter.get("/get-available-cars", carControllers.getAvailableCars);
carRouter.post("/book-car", carControllers.bookCar);
carRouter.post("/return-car", carControllers.returnCar);
carRouter.get("/all-cars", getAvailableCars);

export default carRouter;
