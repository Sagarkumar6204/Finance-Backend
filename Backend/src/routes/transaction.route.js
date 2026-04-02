import express from "express";
import {  updateTransaction, deleteTransaction, getFilterTransactions,  createTransaction, getTransactions, getTransactionStats, exportTransactions } from "../controllers/transaction.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
import validate from "../middlewares/authValidate.middleware.js";
import { authorize } from "../middlewares/accessControl.middleware.js";
import { transactionSchema } from "../validators/transaction.validator.js";
const transactionRouter = express.Router();

// Saare routes protected hain
transactionRouter.use(authenticate);


transactionRouter.get("/all", authorize('read:record'), getTransactions);
transactionRouter.get("/filter",authorize('read:record'), getFilterTransactions);
transactionRouter.get("/export",authorize('read:record'), exportTransactions);


transactionRouter.get("/stats", authorize('view:dashboard'), getTransactionStats);



transactionRouter.post("/add",authorize('create:record'), validate(transactionSchema), createTransaction);
transactionRouter.put("/update/:id", authorize('update:record'), validate(transactionSchema), updateTransaction); // Update par bhi validation zaroori hai
transactionRouter.delete("/delete/:id", authorize('delete:record'), deleteTransaction);

export default transactionRouter;