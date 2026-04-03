import cookieParser from "cookie-parser";
import express from "express";

import authRouter from "./routes/auth.route.js";
import transactionRouter from "./routes/transaction.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import adminRouter from "./routes/admin.route.js";
import cors from "cors";
/**
 * @module  App
 * @description The core Express application instance. 
 * This file orchestrates the high-level middleware stack and route mounting.
 * * 🛠️ Architecture:
 * 1. Global Middlewares: Body parsing and Cookie management.
 * 2. Modular Routing: Separated by domain (Auth, Transactions, Admin).
 * 3. Centralized Error Handling: Catches all downstream errors.
 */
const app= express();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL : true, 
    credentials: true,
   methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});
app.use("/api/auth",authRouter);
app.use("/api/transactions",transactionRouter);
app.use("/api/admin",adminRouter); // Admin routes

app.use(errorMiddleware);

export default app;
