import { Request, Response } from "express";
import Customer from "../models/Customer";
import Retailer from "../models/Retailer";

export const verifyCustomerEmail = async (req: Request, res: Response) => {
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
    const customer = await Customer.findById(id);

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
    await customer.save();

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
  } catch (error) {
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
};

export const verifyRetailerEmail = async (req: Request, res: Response) => {
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
      const retailer = await Retailer.findById(id);
  
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
      await retailer.save();
  
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
    } catch (error) {
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
  };
