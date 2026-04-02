import mongoose from "mongoose";

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
