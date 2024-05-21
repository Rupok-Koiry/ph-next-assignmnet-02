"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAndCreateOrder = exports.deleteOrder = exports.updateOrder = exports.getAllOrders = exports.getOrder = exports.createOrder = void 0;
const orderModel_1 = __importStar(require("../models/orderModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const factory = __importStar(require("./handlerFactory"));
exports.createOrder = factory.createOne(orderModel_1.default);
exports.getOrder = factory.getOne(orderModel_1.default);
exports.getAllOrders = factory.getAll(orderModel_1.default);
exports.updateOrder = factory.updateOne(orderModel_1.default);
exports.deleteOrder = factory.deleteOne(orderModel_1.default);
exports.validateAndCreateOrder = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate request body using Zod schema
    const validationResult = orderModel_1.orderSchemaZod.safeParse(req.body);
    // If validation fails, extract and format the error messages
    if (!validationResult.success) {
        const errors = validationResult.error.errors
            .map((error) => `${error.path.join('.')} - ${error.message}`)
            .join(', ');
        // Return a 400 error with the validation error messages
        return next(new appError_1.default(`Validation failed: ${errors}`, 400));
    }
    // Destructure the validated productId and quantity from the request body
    const { productId, quantity } = req.body;
    // Fetch the product by its ID from the database
    const product = yield productModel_1.default.findById(productId);
    // If no product is found, return a 404 error
    if (!product) {
        return next(new appError_1.default('Product not found', 404));
    }
    // Check if the product has enough inventory to fulfill the order
    if (product.inventory.quantity < quantity) {
        return next(new appError_1.default('Insufficient quantity available in inventory', 400));
    }
    // Update the product's inventory by reducing the quantity
    product.inventory.quantity -= quantity;
    product.inventory.inStock = product.inventory.quantity > 0;
    // Save the updated product information to the database
    yield product.save();
    // Proceed to the next middleware or route handler
    next();
}));
