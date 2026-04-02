import express from "express";
import "dotenv/config";
import connectDB from "./src/config/db.js";
import path from 'path';

import authRouter from "./src/routes/auth.route.js";

import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use(express.json());
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
