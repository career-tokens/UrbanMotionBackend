import express from "express";
import { addCustomer, getAllCustomers, verifyCustomer } from "../controllers/customerControllers";

const router = express.Router();

router.post("/add-customer", addCustomer);
router.post("/verify-customer", verifyCustomer);
router.get("/all-customers", getAllCustomers);

export default router;
