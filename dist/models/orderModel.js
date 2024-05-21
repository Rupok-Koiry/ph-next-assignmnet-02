"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderSchemaZod = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
const appError_1 = __importDefault(require("../utils/appError"));
// Define Zod schema for order validation
exports.orderSchemaZod = zod_1.z.object({
    email: zod_1.z.string().email(),
    productId: zod_1.z.string(),
    price: zod_1.z.number().positive(),
    quantity: zod_1.z.number().int().positive(),
});
// Define Mongoose schema for order
const orderSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    productId: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
});
// Middleware to validate data before saving
orderSchema.pre('validate', function (next) {
    const order = this;
    const validationResult = exports.orderSchemaZod.safeParse(order);
    if (!validationResult.success) {
        const errors = validationResult.error.errors
            .map((error) => `${error.path.join('.')} - ${error.message}`)
            .join(', ');
        return next(new appError_1.default(`Validation failed: ${errors}`, 400));
    }
    next();
});
// Create and export model
const Order = (0, mongoose_1.model)('Order', orderSchema);
exports.default = Order;
