import TransactionModel from "../models/transaction.model.js";
import mongoose from "mongoose";

import { Parser } from 'json2csv';

import ErrorHandler from "../utils/errorHandler.js";

import catchAsync from "../utils/catchAsync.js";
// 1. ADD TRANSACTION
export const createTransaction = catchAsync(async (req, res, next) => {
    // 1. targetUserId ko body se alag nikalo
    const { title, amount, type, category, paymentMethod, date, notes, targetUserId } = req.body;

    // 2. Logic for finalUserId
    const finalUserId = (req.user.role === 'admin' && targetUserId) 
                        ? targetUserId 
                        : req.user._id;

    // 3. Model create karte waqt 'targetUserId' ko mat bhejo, sirf 'userId' bhejo
    const transaction = await TransactionModel.create({
        title,
        amount,
        type,
        category,
        paymentMethod,
        date,
        notes,
        userId: finalUserId // 👈 Model ko 'userId' chahiye
    });

    res.status(201).json({ 
        success: true, 
        message: targetUserId ? "Transaction assigned to user!" : "Transaction added to your account!", 
        data: transaction 
    });
});

// 2. GET ALL TRANSACTIONS (Simple List with Pagination)
export const getTransactions = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {}; 
    if (req.user.role === 'viewer') {
        query.userId = req.user._id;
    }

    const transactions = await TransactionModel.find(query)
        .populate("userId", "username email role") // 👈 Admin ke liye user details dikhana achha hota hai
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);

    const total = await TransactionModel.countDocuments(query);

    res.status(200).json({
        success: true,
        count: transactions.length,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        data: transactions
    });
});

// 5. FILTER TRANSACTIONS (Alag function Date Range aur Type ke liye)
export const getFilterTransactions = catchAsync(async (req, res, next) => {
    const { type, category, startDate, endDate } = req.query;
    // 1. Pehle ek khali query object banao
    let query = {}; 

    // 2. 🛡️ Role-Based Filtering Logic:
    // Agar user 'viewer' hai, toh use sirf uska (self) data dikhao.
    // Agar user 'admin' ya 'analyst' hai, toh 'userId' filter mat lagao (sabka dikhega).
    if (req.user.role === 'viewer') {
        query.userId = req.user._id; 
    }

    // 3. Baaki filters (Jo sabke liye common hain)
    if (type) query.type = type;
    if (category) query.category = category;

    // Date Range Filter (Agar dates di gayi hain)
    if (startDate && endDate) {
        query.date = { 
            $gte: new Date(startDate), 
            $lte: new Date(endDate) 
        };
    }

    // 4. Database se data uthao (userId ko populate kar rahe hain taaki pata chale kiska data hai)
    const transactions = await TransactionModel.find(query)
        .populate("userId", "username email") // 👈 Extra info ke liye
        .sort({ date: -1 });

    // 5. Response handling
    if (!transactions || transactions.length === 0) {
        return res.status(200).json({ 
            success: true, 
            message: "No transactions found for these filters", 
            data: [] 
        });
    }

    res.status(200).json({
        success: true,
        count: transactions.length,
        data: transactions
    });
});


// 3. UPDATE TRANSACTION
export const updateTransaction = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    
    // 🎯 LOGIC: Sirf ID se dhoondo kyunki Admin kisi ka bhi update kar sakta hai
    const transaction = await TransactionModel.findByIdAndUpdate(
        id, 
        req.body, 
        { new: true, runValidators: true }
    );

    if (!transaction) {
        return next(new ErrorHandler("Transaction not found", 404));
    }

    res.status(200).json({ 
        success: true, 
        message: "Transaction updated by Admin!", 
        data: transaction 
    });
});

// 4. DELETE TRANSACTION
export const deleteTransaction = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // 🎯 Global Delete: Kisi bhi userId ka transaction delete ho jayega
    const transaction = await TransactionModel.findByIdAndDelete(id);

    if (!transaction) {
        return next(new ErrorHandler("Transaction not found", 404));
    }

    res.status(200).json({ 
        success: true, 
        message: "Transaction deleted by Admin successfully" 
    });
});
// 5. GET STATS (Aggregation)
export const getTransactionStats = catchAsync(async (req, res, next) => {
    let matchQuery = {};
    if (req.user.role === 'viewer') {
        matchQuery.userId = new mongoose.Types.ObjectId(req.user._id);
    }

    // 1. Overall Stats (Income vs Expense + Counts + Averages)
    const overallStats = await TransactionModel.aggregate([
        { $match: matchQuery },
        {
            $group: {
                _id: "$type",
                totalAmount: { $sum: "$amount" },
                count: { $sum: 1 }, // 👈 Kitne transactions hue
                avgAmount: { $avg: "$amount" } // 👈 Average kharcha/income kitna hai
            }
        }
    ]);

    // 2. Category Stats (Expenses Breakdown)
    const expenseMatchQuery = { ...matchQuery, type: "expense" };
    const categoryStats = await TransactionModel.aggregate([
        { $match: expenseMatchQuery },
        {
            $group: {
                _id: "$category",
                totalSpent: { $sum: "$amount" },
                transactionCount: { $sum: 1 } // 👈 Har category mein kitni baar kharcha hua
            }
        },
        { $sort: { totalSpent: -1 } }
    ]);

    // 3. Formatting the Response
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

    res.status(200).json({
        success: true,
        message: req.user.role === 'viewer' ? "Detailed Personal Stats" : "Detailed Global Stats",
        data: stats
    });
});
// 6. EXPORT TRANSACTIONS
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

// 2. GET TRANSACTIONS (With Pagination & Filters)
// export const getTransactionssss = catchAsync(async (req, res, next) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const query = { userId: req.user._id };

//     if (req.query.type) query.type = req.query.type;
//     if (req.query.category) query.category = req.query.category;
    
//     // Date filter logic
//     if (req.query.startDate && req.query.endDate) {
//         query.date = { 
//             $gte: new Date(req.query.startDate), 
//             $lte: new Date(req.query.endDate) 
//         };
//     }

//     const transactions = await TransactionModel.find(query)
//         .sort({ date: -1 })
//         .skip(skip)
//         .limit(limit);

//     const total = await TransactionModel.countDocuments(query);

//     res.status(200).json({
//         success: true,
//         count: transactions.length,
//         totalPages: Math.ceil(total / limit),
//         currentPage: page,
//         data: transactions
//     });
// });