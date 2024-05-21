import { Schema, Document, model } from 'mongoose';
import { z } from 'zod';
import AppError from '../utils/appError';

// Define interface for order document
interface OrderType extends Document {
  email: string;
  productId: string;
  price: number;
  quantity: number;
}

// Define Zod schema for order validation
export const orderSchemaZod = z.object({
  email: z.string().email(),
  productId: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
});

// Define Mongoose schema for order
const orderSchema = new Schema<OrderType>({
  email: { type: String, required: true },
  productId: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

// Middleware to validate data before saving
orderSchema.pre('validate', function (next) {
  const order = this as OrderType;

  const validationResult = orderSchemaZod.safeParse(order);

  if (!validationResult.success) {
    const errors = validationResult.error.errors
      .map((error) => `${error.path.join('.')} - ${error.message}`)
      .join(', ');

    return next(new AppError(`Validation failed: ${errors}`, 400));
  }

  next();
});

// Create and export model
const Order = model<OrderType>('Order', orderSchema);
export default Order;
