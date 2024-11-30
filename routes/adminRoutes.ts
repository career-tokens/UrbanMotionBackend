import express from "express";
import { addAdmin, getAllAdmins, verifyAdmin } from "../controllers/adminControllers";


const adminRouter = express.Router();

adminRouter.post("/add-admin", addAdmin);
adminRouter.post("/verify-admin", verifyAdmin);
adminRouter.get("/all-admins", getAllAdmins);

export default adminRouter;
