"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const connectDB_1 = __importDefault(require("../utils/connectDB"));
const customerRoutes_1 = __importDefault(require("../routes/customerRoutes"));
const retailerRoutes_1 = __importDefault(require("../routes/retailerRoutes"));
const carRoutes_1 = __importDefault(require("../routes/carRoutes"));
const adminRoutes_1 = __importDefault(require("../routes/adminRoutes"));
const sessionRoute_1 = __importDefault(require("../routes/sessionRoute"));
dotenv_1.default.config();
(0, connectDB_1.default)();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/api/customers", customerRoutes_1.default);
app.use("/api/retailers", retailerRoutes_1.default);
app.use("/api/cars", carRoutes_1.default);
app.use("/api/admins", adminRoutes_1.default);
app.use("/api/sessions", sessionRoute_1.default);
app.listen(3000, () => console.log("Server ready on port 3000."));
