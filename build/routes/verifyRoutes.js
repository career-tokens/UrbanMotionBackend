"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyControllers_1 = require("../controllers/verifyControllers");
const verifyRouter = express_1.default.Router();
verifyRouter.get("/verify-customer", verifyControllers_1.verifyCustomerEmail);
verifyRouter.get("/verify-retailer", verifyControllers_1.verifyRetailerEmail);
exports.default = verifyRouter;
