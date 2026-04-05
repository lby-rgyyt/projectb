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
    const visaStatuses = await VisaStatus.find().populate("employeeId");
    res.status(200).json({
      success: true,
      visaStatuses: visaStatuses,
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
    const visaStatuses = await VisaStatus.find({ inProgress: true }).populate("emplyeeId");
    res.status(200).json({
      success: true,
      visaStatuses: visaStatuses,
    });
  } catch (err) {
    next(err);
  }
};

export const updateVisaStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res
        .status(400)
        .json({ success: false, message: "Visa status ID is required" });
      return;
    }

    const { cueerntStatus, feedback } = req.body;
    const updates: Record<string, string> = {};

    if (cueerntStatus) updates.cueerntStatus = cueerntStatus;

    // only hr can update feedback
    if (feedback !== undefined && req.employee?.role === "hr") {
      updates.feedback = feedback;
    }

    const visaStatus = await VisaStatus.findByIdAndUpdate(
      id,
      { $set: { updates } },
      { new: true },
    );

    if (!visaStatus) {
      res
        .status(404)
        .json({ success: false, message: "Visa status not found" });
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