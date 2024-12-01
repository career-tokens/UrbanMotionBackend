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
exports.verifyRetailerEmail = exports.verifyCustomerEmail = void 0;
const Customer_1 = __importDefault(require("../models/Customer"));
const Retailer_1 = __importDefault(require("../models/Retailer"));
const verifyCustomerEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        if (!id) {
            return res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Failed</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin: 50px; }
            h1 { color: #FF6347; }
            p { margin: 20px 0; }
          </style>
        </head>
        <body>
          <h1>Verification Failed</h1>
          <p>Verification ID is missing or invalid.</p>
        </body>
        </html>
      `);
        }
        // Find the customer by ID
        const customer = yield Customer_1.default.findById(id);
        if (!customer) {
            return res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Failed</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin: 50px; }
            h1 { color: #FF6347; }
            p { margin: 20px 0; }
          </style>
        </head>
        <body>
          <h1>Verification Failed</h1>
          <p>Customer not found or invalid ID.</p>
        </body>
        </html>
      `);
        }
        // Check if the customer is already verified
        if (customer.isVerified) {
            return res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Already Verified</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin: 50px; }
            h1 { color: #32CD32; }
            p { margin: 20px 0; }
          </style>
        </head>
        <body>
          <h1>Already Verified</h1>
          <p>Your email is already verified.</p>
          <button onclick="window.location.href='${process.env.FRONTEND_URL}'">Go to Dashboard</button>
        </body>
        </html>
      `);
        }
        // Update the isVerified field to true
        customer.isVerified = true;
        yield customer.save();
        // Success response
        return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Successful</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; margin: 50px; }
          h1 { color: #32CD32; }
          p { margin: 20px 0; }
          button {
            padding: 10px 20px;
            font-size: 16px;
            color: white;
            background-color: #007BFF;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
          button:hover { background-color: #0056b3; }
        </style>
      </head>
      <body>
        <h1>Verification Successful</h1>
        <p>Thank you! Your email has been successfully verified.</p>
        <button onclick="window.location.href='${process.env.FRONTEND_URL}'">Please Continue On Our App</button>
      </body>
      </html>
    `);
    }
    catch (error) {
        res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Failed</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; margin: 50px; }
          h1 { color: #FF6347; }
          p { margin: 20px 0; }
        </style>
      </head>
      <body>
        <h1>Verification Failed</h1>
        <p>An unexpected error occurred. Please try again later.</p>
      </body>
      </html>
    `);
    }
});
exports.verifyCustomerEmail = verifyCustomerEmail;
const verifyRetailerEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        if (!id) {
            return res.send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verification Failed</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; margin: 50px; }
              h1 { color: #FF6347; }
              p { margin: 20px 0; }
            </style>
          </head>
          <body>
            <h1>Verification Failed</h1>
            <p>Verification ID is missing or invalid.</p>
          </body>
          </html>
        `);
        }
        // Find the retailer by ID
        const retailer = yield Retailer_1.default.findById(id);
        if (!retailer) {
            return res.send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verification Failed</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; margin: 50px; }
              h1 { color: #FF6347; }
              p { margin: 20px 0; }
            </style>
          </head>
          <body>
            <h1>Verification Failed</h1>
            <p>Retailer not found or invalid ID.</p>
          </body>
          </html>
        `);
        }
        // Check if the retailer is already verified
        if (retailer.isVerified) {
            return res.send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Already Verified</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; margin: 50px; }
              h1 { color: #32CD32; }
              p { margin: 20px 0; }
            </style>
          </head>
          <body>
            <h1>Already Verified</h1>
            <p>Your email is already verified.</p>
            <button onclick="window.location.href='${process.env.FRONTEND_URL}'">Go to Dashboard</button>
          </body>
          </html>
        `);
        }
        // Update the isVerified field to true
        retailer.isVerified = true;
        yield retailer.save();
        // Success response
        return res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Successful</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin: 50px; }
            h1 { color: #32CD32; }
            p { margin: 20px 0; }
            button {
              padding: 10px 20px;
              font-size: 16px;
              color: white;
              background-color: #007BFF;
              border: none;
              border-radius: 5px;
              cursor: pointer;
            }
            button:hover { background-color: #0056b3; }
          </style>
        </head>
        <body>
          <h1>Verification Successful</h1>
          <p>Thank you! Your email has been successfully verified.</p>
          <button onclick="window.location.href='${process.env.FRONTEND_URL}'">Please Continue On Our App</button>
        </body>
        </html>
      `);
    }
    catch (error) {
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Failed</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin: 50px; }
            h1 { color: #FF6347; }
            p { margin: 20px 0; }
          </style>
        </head>
        <body>
          <h1>Verification Failed</h1>
          <p>An unexpected error occurred. Please try again later.</p>
        </body>
        </html>
      `);
    }
});
exports.verifyRetailerEmail = verifyRetailerEmail;
