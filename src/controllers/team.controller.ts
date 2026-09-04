import { Request, Response } from "express";

export const createTeam = (req: Request, res: Response) => {
  res.status(201).json({
    message: "createTeam endpoint",
  });
};

export const getTeams = (req: Request, res: Response) => {
  res.status(200).json({
    message: "getTeams endpoint",
  });
};
