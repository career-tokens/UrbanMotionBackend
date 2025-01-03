import express from "express";
import { addCustomer, getAllCustomers, updateCarAndCustomer, updateCustomerByEmail, verifyCustomer } from "../controllers/customerControllers";

const router = express.Router();

router.post("/add-customer", addCustomer);
router.post("/verify-customer", verifyCustomer);
router.get("/all-customers", getAllCustomers);
router.post("/update-customer", updateCustomerByEmail)
router.patch("/update-plan-duration",updateCarAndCustomer)

export default router;
