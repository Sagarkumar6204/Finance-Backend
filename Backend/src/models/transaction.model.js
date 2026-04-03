import mongoose from "mongoose";
/**
 * @typedef {Object} Transaction
 * @property {ObjectId} userId - Reference to the User who owns this transaction.
 * @property {String} title - Brief description of the transaction (max 50 chars).
 * @property {Number} amount - Monetary value (must be at least 1).
 * @property {String} type - Transaction type: 'income' or 'expense'.
 * @property {String} category - Categorization for spending analysis.
 * @property {String} paymentMethod - Mode of transaction: 'cash', 'online', 'card'.
 * @property {Date} date - Date of transaction (defaults to current timestamp).
 * @property {String} notes - Additional remarks (max 250 chars).
 */

/**
 * @desc    Mongoose schema for Financial Transactions.
 * Includes strict validation, enums for data integrity, and indexing for performance.
 * - Relationships: Belongs to a User.
 * - Performance: Compound indexing on userId and date for faster history lookups.
 */
const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Transaction must belong to a user"],
      index: true,
    },

    title: {
      
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [50, "Title cannot exceed 50 characters"],
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [1, "Amount must be at least 1"], // 0 amount ka koi matlab nahi
    },

    type: {
      type: String,
      enum: {
        values: ["income", "expense"],
        message: "{VALUE} is not a valid type",
      },
      required: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "food",
        "rent",
        "salary",
        "shopping",
        "entertainment",
        "health",
        "investment",
        "others",
      ],
      default: "others",
      trim: true,
    },
    paymentMethod: {
      
      type: String,
      enum: ["cash", "online", "card"],
      default: "online",
    },
    
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    notes: { type: String, trim: true, maxlength: 250 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
// ADVANCE: Compound Indexing (UserId + Date)
// Jab hum query karenge: "Sagar ke last 1 month ke transactions dikhao", toh ye index use hoga.
transactionSchema.index({ userId: 1, date: -1 });

const TransactionModel = mongoose.model("Transaction", transactionSchema);
export default TransactionModel;
