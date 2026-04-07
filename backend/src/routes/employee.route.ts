import { Router } from "express";
import {
  getEmployeeById,
  getAllEmployees,
  getEmployeesByName,
  updateEmployeeInfo,
  uploadProfilePicture
} from "../controllers/employee.controller.js";
import { authentication, authorize } from "../middleware/auth.middleware.js";
import { uploadAvatar } from "../middleware/upload.middleware.js";



const router = Router();

router.get("/search", authentication, authorize("hr"), getEmployeesByName);
router.get("/all-employees", authentication, authorize("hr"), getAllEmployees);
router.get("/:id", authentication, authorize("hr"), getEmployeeById);

router.put("/update", authentication, updateEmployeeInfo);
router.put("/profile-picture", authentication, uploadAvatar.single("file"), uploadProfilePicture);

export default router;
