import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../utils/connectDB";
import customerRoutes from "../routes/customerRoutes";
import retailerRoutes from "../routes/retailerRoutes";
import carRoutes from "../routes/carRoutes";
import adminRoutes from "../routes/adminRoutes";
import sessionRoute from "../routes/sessionRoute";
import verifyRoutes from "../routes/verifyRoutes";
import bookingRoutes from "../routes/bookingRoutes";


dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/customers", customerRoutes);
app.use("/api/retailers", retailerRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/sessions", sessionRoute);
app.use("/api/verify", verifyRoutes);
app.use("/api/booking", bookingRoutes);

app.listen(3000, () => console.log("Server ready on port 3000."));
