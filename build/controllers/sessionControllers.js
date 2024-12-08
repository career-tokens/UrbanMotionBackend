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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionData = void 0;
const Session_1 = require("../models/Session");
const Customer_1 = __importDefault(require("../models/Customer"));
const Retailer_1 = __importDefault(require("../models/Retailer"));
const Admin_1 = __importDefault(require("../models/Admin"));
const getSessionData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sessionId } = req.params;
    try {
        const session = yield Session_1.Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }
        const dataId = session.data._id;
        let userData = yield Customer_1.default.findById(dataId);
        if (!userData) {
            userData = yield Retailer_1.default.findById(dataId);
        }
        if (!userData) {
            userData = yield Admin_1.default.findById(dataId);
        }
        if (!userData) {
            return res.status(404).json({ message: "User data not found" });
        }
        session.data = userData;
        yield session.save();
        return res.status(200).json({ data: session.data });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err });
    }
});
exports.getSessionData = getSessionData;
