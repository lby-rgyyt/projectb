import type { Request, Response, NextFunction } from "express";
import FileDocument from "../models/document.model.js";
import VisaStatus from "../models/visaStatus.model.js";
import Employee from "../models/employee.model.js";
import OnboardingApplication from "../models/onboardingApplication.model.js";
import path from "path";

// uploadDocument
export const uploadDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.employee) {
      res.status(401).json({ success: false, error: "Not authenticated" });
      return;
    }
    if (!req.file) {
      res.status(400).json({ success: false, message: "No file uploaded." });
      return;
    }

    const { fileType } = req.body;
    if (!fileType) {
      res
        .status(400)
        .json({ success: false, message: "File type is required." });
      return;
    }

    const doc = await FileDocument.create({
      uploadedBy: req.employee.id,
      fileType,
      filePath: req.file.path,
      originalFileName: req.file.originalname,
    });

    // save all files to employee model
    await Employee.findByIdAndUpdate(req.employee.id, {
      $set: { [`documents.${fileType}`]: doc._id },
    });

    // save files to correalatd models
    const visaTypes = ["optReceipt", "optEAD", "i983", "i20"];
    const onboardingTypes = ["driverLicense", "workAuthorization"];

    if (visaTypes.includes(fileType)) {
      await VisaStatus.findOneAndUpdate(
        { employeeId: req.employee.id },
        {
          $set: {
            [`documents.${fileType}`]: doc._id,
            currentStatus: "pendingApprove",
          },
        },
      );
    } else if (onboardingTypes.includes(fileType)) {
      await OnboardingApplication.findOneAndUpdate(
        { employeeId: req.employee.id },
        { $set: { [`documents.${fileType}`]: doc._id } },
      );
    }
    res.status(201).json({ success: true, document: doc });
  } catch (err) {
    next(err);
  }
};

// downloadDocument
export const downloadDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.employee) {
      res.status(401).json({ success: false, error: "Not authenticated" });
      return;
    }
    const doc = await FileDocument.findById(req.params.id);
    if (!doc) {
      res.status(404).json({ success: false, message: "Document not found" });
      return;
    }

    // only uploader and hr can downlaod
    if (
      doc.uploadedBy.toString() !== req.employee.id &&
      req.employee.role !== "hr"
    ) {
      res.status(403).json({ success: false, message: "Forbidden" });
      return;
    }

    res.download(path.resolve(doc.filePath), doc.originalFileName);
  } catch (err) {
    next(err);
  }
};

// previewDocument
export const previewDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.employee) {
      res.status(401).json({ success: false, error: "Not authenticated" });
      return;
    }
    const doc = await FileDocument.findById(req.params.id);
    if (!doc) {
      res.status(404).json({ success: false, message: "Document not found" });
      return;
    }

    // only uploader and hr can preview
    if (
      doc.uploadedBy.toString() !== req.employee.id &&
      req.employee.role !== "hr"
    ) {
      res.status(403).json({ success: false, message: "Forbidden" });
      return;
    }

    res.sendFile(path.resolve(doc.filePath));
  } catch (err) {
    next(err);
  }
};
