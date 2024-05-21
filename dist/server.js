"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
// Handling uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});
// Load environment variables
dotenv_1.default.config({ path: path_1.default.join((process.cwd(), '.env')) });
// Connect to MongoDB
mongoose_1.default
    .connect(process.env.DATABASE)
    .then(() => console.log('DB connection successful!'))
    .catch((err) => {
    console.error('DB connection error:', err.message);
    process.exit(1);
});
// Start the server
const port = process.env.PORT || 8000;
const server = app_1.default.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
// Handle SIGTERM signal
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('💥 Process terminated!');
    });
});
