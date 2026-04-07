import { Router } from "express";
import {
  getAllVisaStatus,
  getInProgressVisaStatus,
  getMyVisaStatus,
  approveCurrentStep,
  createVisaStatus,
  sendNotificationEmail,
  updateVisaStatus,
} from "../controllers/visaStatus.controller.js";
import { authentication, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/all", authentication, authorize("hr"), getAllVisaStatus);
router.get("/my-visa-status", authentication, getMyVisaStatus);
router.get(
  "/in-progress",
  authentication,
  authorize("hr"),
  getInProgressVisaStatus,
);

router.put("/approve/:id", authentication, authorize("hr"), approveCurrentStep);
router.put("/:id", authentication, authorize("hr"), updateVisaStatus);

router.post("/create", authentication, createVisaStatus);
router.post(
  "/notify/:id",
  authentication,
  authorize("hr"),
  sendNotificationEmail,
);

export default router;
