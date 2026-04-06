import { Router } from "express";
import { downloadDocument,uploadDocument,previewDocument } from "../controllers/document.controller.js";
import { authentication } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

router.post("/upload", authentication, upload.single("file"), uploadDocument);
router.get("/download/:id", authentication, downloadDocument);
router.get("/preview/:id", authentication, previewDocument);

export default router;
