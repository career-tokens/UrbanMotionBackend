"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sessionControllers_1 = require("../controllers/sessionControllers");
const router = express_1.default.Router();
router.get("/:sessionId", sessionControllers_1.getSessionData);
exports.default = router;
