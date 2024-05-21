import { Schema, Document, model } from 'mongoose';
import { z } from 'zod';
import AppError from '../utils/appError';

// Define interface for variant object
type Variant = {
  type: string;
  value: string;
};

// Define interface for inventory object
type Inventory = {
  quantity: number;
  inStock: boolean;
};

// Define interface for product document
interface ProductSchemaType extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  variants: Variant[];
  inventory: Inventory;
}

// Define Zod schema for product validation
const variantSchemaZod = z.object({
  type: z.string(),
  value: z.string(),
});

const inventorySchemaZod = z.object({
  quantity: z.number().int().nonnegative(),
  inStock: z.boolean(),
});

const productSchemaZod = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
  category: z.string(),
  tags: z.array(z.string()).optional(),
  variants: z.array(variantSchemaZod),
  inventory: inventorySchemaZod,
});

// Define Mongoose schema for product
const productSchema = new Schema<ProductSchemaType>({
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
  const order = this as ProductSchemaType;

  const validationResult = productSchemaZod.safeParse(order);

  if (!validationResult.success) {
    const errors = validationResult.error.errors
      .map((error) => `${error.path.join('.')} - ${error.message}`)
      .join(', ');

    return next(new AppError(`Validation failed: ${errors}`, 400));
  }

  next();
});

// Create and export model
const Product = model<ProductSchemaType>('Product', productSchema);
export default Product;
