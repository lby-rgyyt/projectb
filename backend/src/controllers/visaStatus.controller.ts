import type { Request, Response, NextFunction } from "express";
import VisaStatus from "../models/visaStatus.model.js";

export const getMyVisaStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.employee) {
      res.status(401).json({ success: false, error: "Not authenticated" });
      return;
    }
    const employeeId = req.employee.id;
    const visaStatus = await VisaStatus.findOne({ employeeId: employeeId });
    if (!visaStatus) {
      res.status(404).json({ success: false, error: "Visa status not found" });
      return;
    }
    res.status(200).json({
      success: true,
      visaStatus: visaStatus,
    });
  } catch (err) {
    next(err);
  }
};

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
