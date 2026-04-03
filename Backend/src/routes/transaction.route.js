import express from "express";
import {  updateTransaction, deleteTransaction, getFilterTransactions,  createTransaction, getTransactions, getTransactionStats, exportTransactions } from "../controllers/transaction.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
import validate from "../middlewares/authValidate.middleware.js";
import { authorize } from "../middlewares/accessControl.middleware.js";
import { transactionSchema, updateTransactionSchema } from "../validators/transaction.validator.js";
/**
 * @desc    Transaction Management Router
 * @description Centralized hub for managing financial records. 
 * Implements a strict Permission-Based Access Control (PBAC) model.
 * * 🛡️ Security Layers:
 * 1. Authentication: All routes are globally protected by 'authenticate' middleware.
 * 2. Authorization: Specific granular permissions like 'read:record', 'create:record' are required.
 * 3. Validation: Structural integrity of data ensured via Joi schemas for POST/PUT.
 */
const transactionRouter = express.Router();


transactionRouter.use(authenticate);

/**
 * @route   GET /api/transactions/all
 * @desc    Fetch paginated transactions (Self for Viewer, Global for Admin/Analyst).
 * @access  Private (Permission: 'read:record')
 */
transactionRouter.get("/all", authorize('read:record'), getTransactions);
/**
 * @route   GET /api/transactions/filter
 * @desc    Advanced filtering by Category, Type, and Date Range.
 * @access  Private (Permission: 'read:record')
 */
transactionRouter.get("/filter",authorize('read:record'), getFilterTransactions);

/**
 * @route   GET /api/transactions/export
 * @desc    Download financial data in CSV format.
 * @access  Private (Permission: 'read:record')
 */
transactionRouter.get("/export",authorize('read:record'), exportTransactions);

/**
 * @route   GET /api/transactions/stats
 * @desc    Generate financial insights (Income vs Expense & Category Breakdown).
 * @access  Private (Permission: 'view:dashboard')
 */
transactionRouter.get("/stats", authorize('view:dashboard'), getTransactionStats);


/**
 * @route   POST /api/transactions/add
 * @desc    Create a new financial record.
 * @access  Private (Permission: 'create:record')
 * @control validate(transactionSchema) - Strict body validation.
 */
transactionRouter.post("/add",authorize('create:record'), validate(transactionSchema), createTransaction);
/**
 * @route   PUT /api/transactions/update/:id
 * @desc    Modify an existing transaction record.
 * @access  Private (Permission: 'update:record')
 */
transactionRouter.put("/update/:id", authorize('update:record'), validate(updateTransactionSchema), updateTransaction); 
/**
 * @route   DELETE /api/transactions/delete/:id
 * @desc    Permanently remove a transaction from the ledger.
 * @access  Private (Permission: 'delete:record')
 */
transactionRouter.delete("/delete/:id", authorize('delete:record'), deleteTransaction);

export default transactionRouter;