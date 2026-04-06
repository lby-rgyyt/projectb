import express from "express";
import "dotenv/config";
import connectDB from "./src/config/db.js";
import path from 'path';

import authRouter from "./src/routes/auth.route.js";
import employeeRouter from "./src/routes/employee.route.js"
import registrationTokenRouter from "./src/routes/registrationToken.route.js"
import onboardingApplicationRouter from "./src/routes/registrationToken.route.js"
import visaStatusRouter from "./src/routes/visaStatus.route.js"
import documentRouter from "./src/routes/document.route.js"


import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);

app.use('/public', express.static(path.join(__dirname, '..', 'public')));

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/registration-tokens", registrationTokenRouter);
app.use("/api/onboarding-applications", onboardingApplicationRouter);
app.use("/api/visa-status", visaStatusRouter);
app.use("/api/documents",documentRouter);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message || "Internal server error" });
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
