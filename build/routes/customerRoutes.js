"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customerControllers_1 = require("../controllers/customerControllers");
const router = express_1.default.Router();
router.post("/add-customer", customerControllers_1.addCustomer);
router.post("/verify-customer", customerControllers_1.verifyCustomer);
router.get("/all-customers", customerControllers_1.getAllCustomers);
router.post("/update-customer", customerControllers_1.updateCustomerByEmail);
router.patch("/update-plan-duration", customerControllers_1.updateCarAndCustomer);
exports.default = router;
