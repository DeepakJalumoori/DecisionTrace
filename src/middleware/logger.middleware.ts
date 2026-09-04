import { Request, Response, NextFunction } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  console.log(data);
  next();
};

export default logger;
