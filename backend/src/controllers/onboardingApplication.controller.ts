import type { Request, Response, NextFunction } from "express";
import OnboardingApplication from "../models/onboardingApplication.model.js";

export const getOnboardingApplication = async (
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
