import TransactionModel from "../models/transaction.model.js";
import mongoose from "mongoose";
import { Parser } from 'json2csv';
import ErrorHandler from "../utils/errorHandler.js";
import catchAsync from "../utils/catchAsync.js";


/**
 * @desc    create a new transaction (Admin can assign to others via targetUserId)
 * @route   POST /api/transactions/add
 * @access  Private (Admin)
 */
export const createTransaction = catchAsync(async (req, res, next) => {
   
    const { title, amount, type, category, paymentMethod, date, notes, targetUserId } = req.body;


    const finalUserId = (req.user.role === 'admin' && targetUserId) 
                        ? targetUserId 
                        : req.user._id;

    
    const transaction = await TransactionModel.create({
        title,
        amount,
        type,
        category,
        paymentMethod,
        date,
        notes,
        userId: finalUserId 
    });

    return res.status(201).json({ 
        success: true, 
        message: targetUserId ? "Transaction assigned to user!" : "Transaction added to your account!", 
        data: transaction 
    });
});

/**
 * @desc    Get all transactions with Pagination (Role-based access) Self transactions for Viewer, Global for Admin/Analyst.
 * @route   POST /api/transactions/all
 * @query   page (default: 1), limit (default: 10)
 * @access  Private (Admin/Analyst/Viewer)
 */
export const getTransactions = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {}; 
    if (req.user.role === 'viewer') {
        query.userId = req.user._id;
    }

    const transactions = await TransactionModel.find(query)
        .populate("userId", "username email role") 
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);

    const total = await TransactionModel.countDocuments(query);

    return res.status(200).json({
        success: true,
        count: transactions.length,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        data: transactions
    });
});

/**
 * @desc    Advanced Filtering for Transactions (Type, Category, Date Range)
 * @route   GET /api/transactions/filter
 * @access  Private(Admin/Analyst/Viewer)
 */
export const getFilterTransactions = catchAsync(async (req, res, next) => {
    const { type, category, startDate, endDate } = req.query;
   
    if (startDate && endDate) {
        
        
        const start = new Date(startDate);
        const end = new Date(endDate);

       
        if (end < start) {
            return next(new ErrorHandler("End date cannot be earlier than start date.", 400));
        }
    }
  
    let query = {}; 

  
    if (req.user.role === 'viewer') {
        query.userId = req.user._id; 
    }

  
    if (type) query.type = type;
    if (category) query.category = category;

    if (startDate && endDate) {
        query.date = { 
            $gte: new Date(startDate), 
            $lte: new Date(endDate) 
        };
    }

    
    const transactions = await TransactionModel.find(query)
        .populate("userId", "username email") 
        .sort({ date: -1 });

    
    if (!transactions || transactions.length === 0) {
        return res.status(200).json({ 
            success: true, 
            message: "No transactions found for these filters", 
            data: [] 
        });
    }

   return res.status(200).json({
        success: true,
        count: transactions.length,
        data: transactions
    });
});


/**
 * @desc    Update an existing transaction (Admin Only )
 * @route   PUT /api/transactions/update/:id
 * @access  Private (Admin only)
 * @param   {String} id - Transaction ID in params
 */
export const updateTransaction = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const allowedUpdates = ["title", "amount", "type", "category", "paymentMethod", "date", "notes"];
    
    const updates = {};
    Object.keys(req.body).forEach((key) => {
        if (allowedUpdates.includes(key) && req.body[key] !== undefined) {
            updates[key] = req.body[key];
        }
    });

    if (Object.keys(updates).length === 0) {
        return next(new ErrorHandler("No valid fields provided for update", 400));
    }

    const transaction = await TransactionModel.findByIdAndUpdate(
        id, 
        { $set: updates }, 
        { 
            new: true, 
            runValidators: true, 
            context: 'query'     
        }
    );

    if (!transaction) {
        return next(new ErrorHandler("Transaction record not found", 404));
    }

    return res.status(200).json({ 
        success: true, 
        message: "Transaction updated successfully!", 
        data: transaction 
    });
});

/**
 * @desc    Delete a transaction (Admin Only)
 * @route   DELETE /api/transactions/delete/:id
 * @access  Private (Admin only)
 * @param   {String} id - Transaction ID in params
 */
export const deleteTransaction = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    
    const transaction = await TransactionModel.findByIdAndDelete(id);

    if (!transaction) {
        return next(new ErrorHandler("Transaction not found", 404));
    }

    return res.status(200).json({ 
        success: true, 
        message: "Transaction deleted by Admin successfully" 
    });
});



/**
 * @desc    Get Financial Analytics/Stats (Income, Expense, Category Breakdown) Self data for Viewer, Global for Admin/Analyst.
 * @route   GET /api/transactions/stats 
 * @access  Private (Admin/Analyst/Viewer)
 */
export const getTransactionStats = catchAsync(async (req, res, next) => {
    let matchQuery = {};
    if (req.user.role === 'viewer') {
        matchQuery.userId = new mongoose.Types.ObjectId(req.user._id);
    }

   
    const overallStats = await TransactionModel.aggregate([
        { $match: matchQuery },
        {
            $group: {
                _id: "$type",
                totalAmount: { $sum: "$amount" },
                count: { $sum: 1 }, 
                avgAmount: { $avg: "$amount" } 
            }
        }
    ]);

   
    const expenseMatchQuery = { ...matchQuery, type: "expense" };
    const categoryStats = await TransactionModel.aggregate([
        { $match: expenseMatchQuery },
        {
            $group: {
                _id: "$category",
                totalSpent: { $sum: "$amount" },
                transactionCount: { $sum: 1 } 
            }
        },
        { $sort: { totalSpent: -1 } }
    ]);

    
    const incomeData = overallStats.find(s => s._id === 'income');
    const expenseData = overallStats.find(s => s._id === 'expense');

    const stats = {
        summary: {
            totalIncome: incomeData?.totalAmount || 0,
            totalExpense: expenseData?.totalAmount || 0,
            netBalance: (incomeData?.totalAmount || 0) - (expenseData?.totalAmount || 0),
            totalTransactions: (incomeData?.count || 0) + (expenseData?.count || 0)
        },
        averages: {
            avgIncome: Math.round(incomeData?.avgAmount || 0),
            avgExpense: Math.round(expenseData?.avgAmount || 0)
        },
        counts: {
            incomeCount: incomeData?.count || 0,
            expenseCount: expenseData?.count || 0
        },
        categoryBreakdown: categoryStats
    };

    return res.status(200).json({
        success: true,
        message: req.user.role === 'viewer' ? "Detailed Personal Stats" : "Detailed Global Stats",
        data: stats
    });
});



/**
 * @desc    Export Transactions to CSV (Self data for Viewer, Global for Admin/Analyst)
 * @route   GET /api/transactions/export
 * @access  Private (Admin, Analyst, Viewer)
 */
export const exportTransactions = catchAsync(async (req, res, next) => {

      let query = {}; 
    if (req.user.role === 'viewer') {
        query.userId = req.user._id;
    }
    const transactions = await TransactionModel.find(query).sort({ date: -1 });

    if (!transactions || transactions.length === 0) {
        return next(new ErrorHandler("No data to export", 404));
    }

    const fields = ['title', 'amount', 'type', 'category', 'date', 'notes'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(transactions);

    res.header('Content-Type', 'text/csv');
    res.attachment('my-transactions.csv');
    
    return res.send(csv);
});

