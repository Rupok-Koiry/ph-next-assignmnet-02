import { Request, Response, NextFunction } from 'express';
import { Model, Document } from 'mongoose';
import catchAsync from './../utils/catchAsync';
import AppError from './../utils/appError';
import APIFeatures from './../utils/apiFeatures';

export const deleteOne = <T extends Document>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(`${Model.modelName} not found`, 404));
    }

    res.status(202).json({
      success: true,
      message: `${Model.modelName} deleted successfully!`,
      data: null,
    });
  });

export const updateOne = <T extends Document>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(`${Model.modelName} not found`, 404));
    }

    res.status(200).json({
      success: true,
      message: `${Model.modelName} updated successfully!`,
      data: doc,
    });
  });

export const createOne = <T extends Document>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      success: true,
      message: `${Model.modelName} created successfully!`,
      data: doc,
    });
  });

export const getOne = <T extends Document>(
  Model: Model<T>,
  popOptions?: string,
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError(`${Model.modelName} not found`, 404));
    }

    res.status(200).json({
      success: true,
      message: `${Model.modelName} fetched successfully!`,
      data: doc,
    });
  });

export const getAll = <T extends Document>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response) => {
    // EXECUTE QUERY
    let message: string;
    if (req.query.searchTerm) {
      message = `${Model.modelName}s matching search term '${req.query.searchTerm}' fetched successfully!`;
    } else if (req.query.email) {
      message = `${Model.modelName}s fetched successfully for user email!`;
    } else {
      message = `${Model.modelName}s fetched successfully!`;
    }
    // APi features
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      success: true,
      message,
      data: doc,
    });
  });
