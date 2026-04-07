import type { Request, Response, NextFunction } from "express";
import OnboardingApplication from "../models/onboardingApplication.model.js";
import Employee from "../models/employee.model.js";

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
      await OnboardingApplication.find(requestedStatus).populate("employeeId");
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
    }).populate("employeeId");
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
    }).populate("employeeId");
    res.status(200).json({
      success: true,
      onboardingApplication: onboardingApplication || null,
    });
  } catch (err) {
    next(err);
  }
};

export const createOnboardingApplication = async (
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

    const existing = await OnboardingApplication.findOne({ employeeId });
    if (existing) {
      res
        .status(409)
        .json({ success: false, message: "Application already exists." });
      return;
    }

    const application = await OnboardingApplication.create({
      employeeId: employeeId,
    });

    await Employee.findByIdAndUpdate(employeeId, {
      onboardingApplication: application._id,
    });

    res.status(201).json({
      success: true,
      onboardingApplication: application,
    });
  } catch (err) {
    next(err);
  }
};

export const updateOnboardingApplication = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res
        .status(400)
        .json({ success: false, message: "Application ID is required" });
      return;
    }

    const { status, feedback } = req.body;
    const updates: Record<string, string> = {};

    if (status) updates.status = status;

    // only hr can update feedback
    if (feedback !== undefined && req.employee?.role === "hr") {
      updates.feedback = feedback;
    }

    const application = await OnboardingApplication.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true },
    );

    if (!application) {
      res
        .status(404)
        .json({ success: false, message: "Application not found" });
      return;
    }

    res.status(200).json({
      success: true,
      onboardingApplication: application,
    });
  } catch (err) {
    next(err);
  }
};
