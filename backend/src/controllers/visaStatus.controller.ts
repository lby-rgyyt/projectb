import type { Request, Response, NextFunction } from "express";
import VisaStatus from "../models/visaStatus.model.js";

export const getAllVisaStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const applications = await VisaStatus.find();
    res.status(200).json({
      success: true,
      applications: applications,
    });
  } catch (err) {
    next(err);
  }
};

export const getInProgressVisaStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const applications = await VisaStatus.find({ inProgress: true });
    res.status(200).json({
      success: true,
      applications: applications,
    });
  } catch (err) {
    next(err);
  }
};
