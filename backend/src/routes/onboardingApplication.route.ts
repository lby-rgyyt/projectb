import { Router } from "express";
import {
  getAllOnboardingApplications,
  getOnboardingApplicationByEmployeeId,
  getMyOnboardingApplication,
} from "../controllers/onboardingApplication.controller.js";
import { authentication, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/all",
  authentication,
  authorize("hr"),
  getAllOnboardingApplications,
);
router.get("/my-application", authentication, getMyOnboardingApplication);
router.get(
  "/:id",
  authentication,
  authorize("hr"),
  getOnboardingApplicationByEmployeeId,
);

export default router;
