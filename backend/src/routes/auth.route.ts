import { Router } from "express";
import { login, register,getMe } from "../controllers/auth.controller.js";
import { authentication } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/me",authentication,getMe);
router.post("/login", login);
router.post("/register", register);

export default router;
