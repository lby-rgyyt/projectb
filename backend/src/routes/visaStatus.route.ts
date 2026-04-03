import { Router } from "express";
import {
  getAllVisaStatus,
  getInProgressVisaStatus,
} from "../controllers/visaStatus.controller.js";
import { authentication, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/all", authentication, authorize("hr"), getAllVisaStatus);
router.get(
  "/inProgress",
  authentication,
  authorize("hr"),
  getInProgressVisaStatus,
);

export default router;
