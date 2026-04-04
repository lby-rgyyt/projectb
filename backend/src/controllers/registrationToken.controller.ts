import type { Request, Response, NextFunction } from "express";
import RegisterToken from "../models/registrationToken.js";
import Employee from "../models/employee.model.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

export const sendRegistrationEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.employee) {
      res.status(401).json({ success: false, error: "Not authenticated" });
      return;
    }
    const { name, email } = req.body;
    const existing = await RegisterToken.findOne({ email });
    if (existing) {
      res.status(409).json({ success: false, message: "Email already sent." });
      return;
    }

    const token = crypto.randomBytes(32).toString("hex");
    const link = `${process.env.FRONTEND_URL}/signup?token=${token}&email=${email}`;

    await RegisterToken.create({
      email,
      name,
      token,
      link,
      status: "pending",
      createdBy: req.employee.id,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Create your account",
      html: `
            <h2>Welcome to HR Portal, ${name}!</h2>
            <p>Please click the link below to create your account:</p>
            <a href="${link}">${link}</a>
            <p>This link will expire in 3 hours.</p>
            `,
    });

    res.status(200).json({
      success: true,
      message: "A registration link has been sent.",
    });
  } catch (err) {
    next(err);
  }
};

export const getTokenHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await RegisterToken.updateMany(
      {
        status: { $ne: "expired" },
        createdAt: { $lt: new Date(Date.now() - 3 * 60 * 60 * 1000) },
      },
      { status: "expired" },
    );
    const tokens = await RegisterToken.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      tokens: tokens,
    });
  } catch (err) {
    next(err);
  }
};

export const checkToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
      res
        .status(400)
        .json({ success: false, message: "Token must be included." });
      return;
    }
    const registerToken = await RegisterToken.findOne({ token: token });
    if (!registerToken) {
      res
        .status(409)
        .json({ success: false, message: "Registration token not existed." });
      return;
    }
    if (registerToken.status !== "pending") {
      res
        .status(409)
        .json({ success: false, message: "Invalid token status." });
      return;
    }
    if (registerToken.createdAt < new Date(Date.now() - 3 * 60 * 60 * 1000)) {
      res.status(409).json({ success: false, message: "Token has expired." });
      return;
    }
    res.status(200).json({ success: true, message: "Token is valid." });
  } catch (err) {
    next(err);
  }
};
