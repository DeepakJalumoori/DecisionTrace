import { Request, Response } from "express";

export const register = (req: Request, res: Response) => {
  res.status(201).json({
    message: "Registration endpoint",
  });
};

export const login = (req: Request, res: Response) => {
  res.status(200).json({
    message: "LogIn endpoint",
  });
};
