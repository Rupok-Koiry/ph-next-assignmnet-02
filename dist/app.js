"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app.ts
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const appError_1 = __importDefault(require("./utils/appError"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
// Create express app
const app = (0, express_1.default)();
// Enable Cross-Origin Resource Sharing (CORS)
app.use((0, cors_1.default)());
app.options('*', (0, cors_1.default)());
// Parse JSON and URL-encoded data and cookies
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
app.use((0, cookie_parser_1.default)());
// Route handlers
app.use('/api/products', productRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
// Handle all undefined routes
app.all('*', (req, res, next) => {
    next(new appError_1.default(`Route not found`, 404));
});
// Global error handling middleware
app.use(errorController_1.default);
exports.default = app;
