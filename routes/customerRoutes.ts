import express from "express";
import { addCustomer, getAllCustomers, updateCustomerByEmail, verifyCustomer } from "../controllers/customerControllers";

const router = express.Router();

router.post("/add-customer", addCustomer);
router.post("/verify-customer", verifyCustomer);
router.get("/all-customers", getAllCustomers);
router.post("/update-customer",updateCustomerByEmail)

export default router;
