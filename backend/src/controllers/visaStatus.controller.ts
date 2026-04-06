import type { Request, Response, NextFunction } from "express";
import nodemailer from "nodemailer";
import VisaStatus from "../models/visaStatus.model.js";
import type { IEmployee } from "../models/employee.model.js";

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
    const visaStatuses = await VisaStatus.find({ inProgress: true }).populate(
      "employeeId",
    );
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

    const { currentStatus, feedback } = req.body;
    const updates: Record<string, string> = {};

    if (currentStatus) updates.currentStatus = currentStatus;

    // only hr can update feedback
    if (feedback !== undefined && req.employee?.role === "hr") {
      updates.feedback = feedback;
    }

    const visaStatus = await VisaStatus.findByIdAndUpdate(
      id,
      { $set: updates },
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

export const approveCurrentStep = async (
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

    const visaStatus = await VisaStatus.findById(id);
    if (!visaStatus) {
      res
        .status(404)
        .json({ success: false, message: "Visa status not found" });
      return;
    }

    // get next step
    const steps = ["optReceipt", "optEAD", "i983", "i20", "completed"];
    const currentIndex = steps.indexOf(visaStatus.currentStep);
    const nextStep = steps[currentIndex + 1];

    // update status
    visaStatus.currentStep = nextStep as typeof visaStatus.currentStep;
    visaStatus.currentStatus =
      nextStep === "completed" ? "approved" : "pendingSubmit";
    visaStatus.feedback = "";
    if (nextStep === "completed") {
      visaStatus.inProgress = false;
    }

    await visaStatus.save();

    res.status(200).json({
      success: true,
      visaStatus: visaStatus,
    });
  } catch (err) {
    next(err);
  }
};

export const sendNotificationEmail = async (
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

    const visaStatus = await VisaStatus.findById(id).populate("employeeId");
    if (!visaStatus) {
      res
        .status(404)
        .json({ success: false, message: "Visa status not found" });
      return;
    }

    // employeeId has been populated to a complete Employee object, we should do a transformation
    // or simply just use "as any"
    const emp = visaStatus.employeeId as unknown as IEmployee;
    const stepLabels: Record<string, string> = {
      optReceipt: "OPT Receipt",
      optEAD: "OPT EAD",
      i983: "I-983",
      i20: "I-20",
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: emp.email,
      subject: `Reminder: Please upload your ${stepLabels[visaStatus.currentStep]}`,
      html: `
        <h2>Hi ${emp.firstName || ""},</h2>
        <p>This is a reminder to upload your <strong>${stepLabels[visaStatus.currentStep]}</strong>.</p>
        <p>Please log in to the HR Portal to complete this step.</p>
      `,
    });

    res.status(200).json({ success: true, message: "Notification sent." });
  } catch (err) {
    next(err);
  }
};
