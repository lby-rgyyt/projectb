import type { Request, Response, NextFunction } from "express";
import RegisterToken from "../models/registrationToken.js";

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
    const tokens = await RegisterToken.find();
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
    next();
  }
};
