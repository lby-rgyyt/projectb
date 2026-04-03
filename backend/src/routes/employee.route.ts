import { Router } from "express";
import { getEmployeeById } from "../controllers/employee.controller.js";
import { authentication } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/:id", authentication, getEmployeeById);

export default router;
