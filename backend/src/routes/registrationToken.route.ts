import { Router } from "express";
import { getTokenHistory } from "../controllers/registrationToken.controller.js";
import { authentication,authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/all", authentication,authorize("hr"), getTokenHistory);

export default router;
