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
