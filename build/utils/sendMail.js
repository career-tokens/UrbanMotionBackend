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
exports.default = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Function to send email
function sendEmail(to, subject, html) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create a transporter object using the default SMTP transport
        let transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.BUSINESS_EMAIL,
                pass: process.env.BUSINESS_EMAIL_APP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        // Setup email data
        let mailOptions = {
            to: to, // list of receivers
            subject: subject, // Subject line
            html: html // plain html body
        };
        try {
            // Send mail with defined transport object
            let info = yield transporter.sendMail(mailOptions);
            console.log('Message sent: %s', info.messageId);
        }
        catch (error) {
            console.error('Error sending email: %s', error);
        }
    });
}
