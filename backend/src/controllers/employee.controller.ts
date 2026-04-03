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
