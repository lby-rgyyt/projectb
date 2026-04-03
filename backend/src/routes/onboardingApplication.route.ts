import { Router } from "express";
import { getOnboardingApplication } from "../controllers/onboardingApplication.controller.js";
import { authentication,authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/all", authentication,authorize("hr"), getOnboardingApplication);

export default router;
