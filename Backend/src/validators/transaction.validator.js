import Joi from "joi";

/**
 * @desc    Financial Transaction Validation Schema
 * @description Validates the payload for creating or updating financial records.
 * - Title: 3-50 characters, trimmed.
 * - Amount: Must be a positive number (Strictly > 0).
 * - Type: Restricted to 'income' or 'expense'.
 * - Category: Must match predefined financial categories.
 * - targetUserId: Optional field, but must be a valid 24-character Hex string (MongoDB ObjectId).
 */
export const transactionSchema = Joi.object({
   
    title: Joi.string().min(3).max(50).required().messages({
        "string.min": "Title must be at least 3 characters long",
        "any.required": "Title is required"
    }),
    amount: Joi.number().positive().required().messages({
        "number.positive": "Amount must be a positive number"
    }),
    type: Joi.string().valid("income", "expense").required(),
    category: Joi.string().valid('food', 'rent', 'salary', 'shopping', 'entertainment', 'health', 'investment', 'others').required(),
    paymentMethod: Joi.string().valid('cash', 'online', 'card').default('online'),
    date: Joi.date().iso().default(() => new Date()),
    notes: Joi.string().max(250).allow(''),
   targetUserId: Joi.string()
    .hex()
    .length(24)
    .optional(),

}); 
export const updateTransactionSchema = Joi.object({
    title: Joi.string().optional().messages({
        'string.base': 'Title must be a string text.',
    }),
    amount: Joi.number().optional().messages({
        'number.base': 'Amount must be a valid number.',
        'number.positive': 'Amount cannot be a negative value.',
    }),
    category: Joi.string().optional().messages({
        'string.base': 'Category must be a string text.',
    }),
    type: Joi.string().valid('income', 'expense').optional().messages({
        'any.only': 'Type must be either "income" or "expense".',
    }),
    paymentMethod: Joi.string().optional().messages({
        'string.base': 'Payment method must be a valid string.',
    }),
    date: Joi.date().optional().messages({
        'date.base': 'Please provide a valid date format.',
    }),
    notes: Joi.string().optional(),
    targetUserId: Joi.string().optional().messages({
        'string.base': 'Target User ID must be a valid string.',
    })
}).min(1).messages({
    'object.min': 'At least one field must be provided for the update operation.'
});