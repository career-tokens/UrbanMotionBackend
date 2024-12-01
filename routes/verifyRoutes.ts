import express from "express";
import { verifyCustomerEmail, verifyRetailerEmail } from "../controllers/verifyControllers";

const verifyRouter = express.Router();

verifyRouter.get("/verify-customer", verifyCustomerEmail);
verifyRouter.get("/verify-retailer", verifyRetailerEmail);


export default verifyRouter;