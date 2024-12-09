"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminControllers_1 = require("../controllers/adminControllers");
const adminRouter = express_1.default.Router();
adminRouter.post("/add-admin", adminControllers_1.addAdmin);
adminRouter.post("/verify-admin", adminControllers_1.verifyAdmin);
adminRouter.get("/all-admins", adminControllers_1.getAllAdmins);
adminRouter.post("/update-admin", adminControllers_1.updateAdminByEmail);
exports.default = adminRouter;
