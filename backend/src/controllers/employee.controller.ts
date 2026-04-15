import type { Request, Response, NextFunction } from "express";
import Employee from "../models/employee.model.js";
import mongoose from "mongoose";

export const getEmployeeById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      res.status(404).json({ success: false, message: "Employee not found" });
      return;
    }
    res.status(200).json({
      success: true,
      employee: employee,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const employees = await Employee.find();
    res.status(200).json({
      success: true,
      employees: employees,
    });
  } catch (err) {
    next(err);
  }
};

export const getEmployeesByName = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name } = req.query;
    // no query, retuan all employees
    if (!name || typeof name !== "string") {
      const employees = await Employee.find().sort({ lastName: 1 });
      res.status(200).json({ success: true, employees: employees });
      return;
    }
    const regex = new RegExp(name, "i");
    const employees = await Employee.find({
      $or: [
        { firstName: regex },
        { lastName: regex },
        { preferredName: regex },
      ],
    }).sort({ lastName: 1 });
    res.status(200).json({ success: true, employees: employees });
  } catch (err) {
    next(err);
  }
};

export const uploadProfilePicture = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.employee) {
    res.status(401).json({ success: false, error: "Not authenticated" });
    return;
  }
  if (!req.file) {
    res.status(400).json({ success: false, message: "No file uploaded." });
    return;
  }

  const filePath = `public/avatars/${req.file.filename}`;
  await Employee.findByIdAndUpdate(req.employee.id, {
    profilePicture: filePath,
  });

  res.status(200).json({ success: true, filePath: filePath });
};

export const updateEmployeeInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const allowedFields = [
      "firstName",
      "lastName",
      "middleName",
      "preferredName",
      "ssn",
      "dateOfBirth",
      "gender",
      "address",
      "cellPhone",
      "workPhone",
      "reference",
      "emergencyContacts",
      "visaType",
      "visaTitle",
      "visaStartDate",
      "visaEndDate",
    ];
    const updates: Record<string, any> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }
    if (!req.employee) {
      res.status(401).json({ success: false, error: "Not authenticated" });
      return;
    }
    const { id } = req.employee;
    const employee = await Employee.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true },
    );
    if (!employee) {
      res.status(404).json({ success: false, error: "Employee not found" });
      return;
    }
    res.status(200).json({
      success: true,
      employee: employee,
    });
  } catch (err) {
    next(err);
  }
};
