import cors from "cors"; // Import CORS package
import dotenv from "dotenv";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import xss from "xss-clean";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import userRouter from "./routes/user.route.js";

// Fix for `__dirname` in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error:" + err);
  });

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Set static folder
// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static('public'));

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
// ✅ Serve Static Files (Fix Image Display Issue)
app.use("/uploads", express.static("public/uploads")); // ✅ Fix

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000 !!");
});
