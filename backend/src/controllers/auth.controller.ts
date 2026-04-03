import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Employee from "../models/employee.model.js";
import type { Request, Response, NextFunction } from "express";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    const existing = await Employee.find({ $or: [{ username }, { email }] });
    const errors: Record<string, string> = {};
    for (const record of existing) {
      if (record.username === username) {
        errors["username"] = "Username already in use";
      }
      if (record.email === email) {
        errors["email"] = "Email already in use";
      }
    }
    if (Object.keys(errors).length > 0) {
      res.status(409).json({ success: false, errors: errors });
      return;
    }
    const employee = await Employee.create({ username, email, password });
    const token = jwt.sign(
      { id: employee._id, role: employee.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );
    res.status(201).json({
      success: true,
      token,
      employee: {
        id: employee._id,
        username: employee.username,
        email: employee.email,
        role: employee.role,
        onboardingApplication: employee.onboardingApplication,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username, password } = req.body;
    const employee = await Employee.findOne({ username }).select("+password").populate("onboardingApplication");
    if (!employee) {
      res.status(401).json({ success: false, errors: "Username not existed" });
      return;
    }
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      res.status(401).json({ success: false, errors: "Invalid password" });
      return;
    }
    const token = jwt.sign(
      { id: employee._id, role: employee.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );
    res.status(200).json({
      success: true,
      token,
      employee: {
        id: employee._id,
        username: employee.username,
        email: employee.email,
        role: employee.role,
        onboardingApplication: employee.onboardingApplication,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.employee) {
      res.status(401).json({ success: false, error: "Not authenticated" });
      return;
    }
    const { id } = req.employee;
    const employee = await Employee.findById(id).populate("onboardingApplication");
    if (!employee) {
      res.status(404).json({ success: false, error: "Employee not found" });
      return;
    }
    res.status(200).json({
      success: true,
      employee: {
        id: employee._id,
        username: employee.username,
        email: employee.email,
        role: employee.role,
        onboardingApplication: employee.onboardingApplication,
      },
    });
  } catch (err) {
    next(err);
  }
};
