"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// A utility function to catch asynchronous errors in Express route handlers
const catchAsync = (
// eslint-disable-next-line no-unused-vars
fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.default = catchAsync;
