import { Request, Response } from "express";
import { Session } from "../models/Session";

export const getSessionData = async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  try {
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    return res.status(200).json({ data: session.data });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err });
  }
};
