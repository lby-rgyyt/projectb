import type { Request, Response, NextFunction } from "express";
import OnboardingApplication from "../models/onboardingApplication.model.js";

export const getAllOnboardingApplications = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const requestedStatus = req.query.status
      ? { status: req.query.status }
      : {};
    const onboardingApplications =
      await OnboardingApplication.find(requestedStatus);
    res.status(200).json({
      success: true,
      onboardingApplications: onboardingApplications,
    });
  } catch (err) {
    next(err);
  }
};

export const getOnboardingApplicationByEmployeeId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res
        .status(400)
        .json({ success: false, message: "Employee ID is required" });
      return;
    }
    const onboardingApplication = await OnboardingApplication.findOne({
      employeeId: id,
    });
    if (!onboardingApplication) {
      res
        .status(404)
        .json({ success: false, message: "Onboarding application not found" });
      return;
    }
    res.status(200).json({
      success: true,
      onboardingApplication: onboardingApplication,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyOnboardingApplication = async (
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
    const onboardingApplication = await OnboardingApplication.findOne({
      employeeId: employeeId,
    });
    if (!onboardingApplication) {
      res
        .status(404)
        .json({ success: false, error: "Onboarding application not found" });
      return;
    }
    res.status(200).json({
      success: true,
      onboardingApplication: onboardingApplication,
    });
  } catch (err) {
    next(err);
  }
};
