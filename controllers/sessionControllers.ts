// @ts-nocheck
import { Request, Response } from "express";
import { Session } from "../models/Session";
import Customer from "../models/Customer";
import Retailer from "../models/Retailer";
import Admin from "../models/Admin";



export const getSessionData = async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  try {
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const dataId = session.data._id;

    let userData = await Customer.findById(dataId);
    if (!userData) {
      userData = await Retailer.findById(dataId);
    }
    if (!userData) {
      userData = await Admin.findById(dataId);
    }

    if (!userData) {
      return res.status(404).json({ message: "User data not found" });
    }

    session.data = userData;
    await session.save();

    return res.status(200).json({ data: session.data });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err });
  }
};