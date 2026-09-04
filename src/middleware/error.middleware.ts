import { Request, Response, NextFunction } from "express";

const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(500).json({
    message: "Internal server error",
  });
};

export default errorMiddleware;
