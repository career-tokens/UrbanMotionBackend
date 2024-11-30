import express from "express";
import { addRetailer, getAllRetailers, verifyRetailer } from "../controllers/retailerControllers";

const retailerRouter = express.Router();

retailerRouter.post("/add-retailer", addRetailer);
retailerRouter.post("/verify-retailer", verifyRetailer);
retailerRouter.get("/all-retailers", getAllRetailers);

export default retailerRouter;
