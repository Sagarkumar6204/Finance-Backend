import cookieParser from "cookie-parser";
import express from "express";

import authRouter from "./routes/auth.route.js";
import transactionRouter from "./routes/transaction.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import adminRouter from "./routes/admin.route.js";

const app= express();


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRouter);
app.use("/api/transactions",transactionRouter);
app.use("/api/admin",adminRouter); // Admin routes

app.use(errorMiddleware);

export default app;
