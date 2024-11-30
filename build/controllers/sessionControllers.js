"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionData = void 0;
const Session_1 = require("../models/Session");
const getSessionData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sessionId } = req.params;
    try {
        const session = yield Session_1.Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }
        return res.status(200).json({ data: session.data });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err });
    }
});
exports.getSessionData = getSessionData;
