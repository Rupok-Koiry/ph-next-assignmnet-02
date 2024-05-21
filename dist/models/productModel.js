"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
const appError_1 = __importDefault(require("../utils/appError"));
// Define Zod schema for product validation
const variantSchemaZod = zod_1.z.object({
    type: zod_1.z.string(),
    value: zod_1.z.string(),
});
const inventorySchemaZod = zod_1.z.object({
    quantity: zod_1.z.number().int().nonnegative(),
    inStock: zod_1.z.boolean(),
});
const productSchemaZod = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    price: zod_1.z.number().positive(),
    category: zod_1.z.string(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    variants: zod_1.z.array(variantSchemaZod),
    inventory: inventorySchemaZod,
});
// Define Mongoose schema for product
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    variants: [
        {
            type: { type: String, required: true },
            value: { type: String, required: true },
            _id: false,
        },
    ],
    inventory: {
        quantity: { type: Number, required: true },
        inStock: { type: Boolean, required: true },
    },
});
// Middleware to validate data before saving
productSchema.pre('validate', function (next) {
    const order = this;
    const validationResult = productSchemaZod.safeParse(order);
    if (!validationResult.success) {
        const errors = validationResult.error.errors
            .map((error) => `${error.path.join('.')} - ${error.message}`)
            .join(', ');
        return next(new appError_1.default(`Validation failed: ${errors}`, 400));
    }
    next();
});
// Create and export model
const Product = (0, mongoose_1.model)('Product', productSchema);
exports.default = Product;
