import { Router } from "express";
import {
  getTokenHistory,
  checkToken,
  sendRegistrationEmail
} from "../controllers/registrationToken.controller.js";
import { authentication, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/all", authentication, authorize("hr"), getTokenHistory);
router.get("/check", authentication, authorize("hr"), checkToken);
router.post("/invite",authentication,authorize("hr"),sendRegistrationEmail);

export default router;
