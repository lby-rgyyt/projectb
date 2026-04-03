import { Router } from "express";
import {
  getAllVisaStatus,
  getInProgressVisaStatus,
  getMyVisaStatus
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

export default router;
