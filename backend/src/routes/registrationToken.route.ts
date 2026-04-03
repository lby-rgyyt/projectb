import { Router } from "express";
import {
  getTokenHistory,
  checkToken,
} from "../controllers/registrationToken.controller.js";
import { authentication, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/all", authentication, authorize("hr"), getTokenHistory);
router.get("/check", authentication, authorize("hr"), checkToken);

export default router;
