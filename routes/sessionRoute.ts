import express from "express";
import { getSessionData } from "../controllers/sessionControllers";


const router = express.Router();

router.get("/:sessionId", getSessionData);

export default router;
