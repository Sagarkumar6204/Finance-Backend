import Joi from "joi";

 console.log("SCHEMA LOADED ✅");
export const transactionSchema = Joi.object({
   
    title: Joi.string().min(3).max(50).required().messages({
        "string.min": "Title kam se kam 3 characters ka hona chahiye",
        "any.required": "Title zaroori hai"
    }),
    amount: Joi.number().positive().required().messages({
        "number.positive": "Amount hamesha 0 se bada hona chahiye"
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

}); // unknown(true) se extra fields allow ho jayenge, par validation sirf defined fields pe hoga