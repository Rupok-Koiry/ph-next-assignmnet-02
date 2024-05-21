import { Request, Response, NextFunction } from 'express';

// A utility function to catch asynchronous errors in Express route handlers
const catchAsync = (
  // eslint-disable-next-line no-unused-vars
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
