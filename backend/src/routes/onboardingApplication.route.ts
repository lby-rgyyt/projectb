import { Router } from "express";
import {
  getAllOnboardingApplications,
  getOnboardingApplicationByEmployeeId,
  getMyOnboardingApplication,
  createOnboardingApplication,
  updateOnboardingApplication,
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
  "/employee/:id",
  authentication,
  authorize("hr"),
  getOnboardingApplicationByEmployeeId,
);

router.post("/create", authentication, createOnboardingApplication);

router.put("/:id", authentication, updateOnboardingApplication);

export default router;
