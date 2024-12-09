import express from "express";
import { addRetailer, getAllRetailers, updateRetailerByEmail, verifyRetailer } from "../controllers/retailerControllers";

const retailerRouter = express.Router();

retailerRouter.post("/add-retailer", addRetailer);
retailerRouter.post("/verify-retailer", verifyRetailer);
retailerRouter.get("/all-retailers", getAllRetailers);
retailerRouter.post("/update-retailer", updateRetailerByEmail);

export default retailerRouter;
