import Order, { orderSchemaZod } from '../models/orderModel';
import Product from '../models/productModel';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import * as factory from './handlerFactory';

export const createOrder = factory.createOne(Order);
export const getOrder = factory.getOne(Order);
export const getAllOrders = factory.getAll(Order);
export const updateOrder = factory.updateOne(Order);
export const deleteOrder = factory.deleteOne(Order);

export const validateAndCreateOrder = catchAsync(async (req, res, next) => {
  // Validate request body using Zod schema
  const validationResult = orderSchemaZod.safeParse(req.body);

  // If validation fails, extract and format the error messages
  if (!validationResult.success) {
    const errors = validationResult.error.errors
      .map((error) => `${error.path.join('.')} - ${error.message}`)
      .join(', ');
    // Return a 400 error with the validation error messages
    return next(new AppError(`Validation failed: ${errors}`, 400));
  }

  // Destructure the validated productId and quantity from the request body
  const { productId, quantity } = req.body;

  // Fetch the product by its ID from the database
  const product = await Product.findById(productId);

  // If no product is found, return a 404 error
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // Check if the product has enough inventory to fulfill the order
  if (product.inventory.quantity < quantity) {
    return next(
      new AppError('Insufficient quantity available in inventory', 400),
    );
  }

  // Update the product's inventory by reducing the quantity
  product.inventory.quantity -= quantity;
  product.inventory.inStock = product.inventory.quantity > 0;

  // Save the updated product information to the database
  await product.save();

  // Proceed to the next middleware or route handler
  next();
});
