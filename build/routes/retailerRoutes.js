"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const retailerControllers_1 = require("../controllers/retailerControllers");
const retailerRouter = express_1.default.Router();
retailerRouter.post("/add-retailer", retailerControllers_1.addRetailer);
retailerRouter.post("/verify-retailer", retailerControllers_1.verifyRetailer);
retailerRouter.get("/all-retailers", retailerControllers_1.getAllRetailers);
exports.default = retailerRouter;
