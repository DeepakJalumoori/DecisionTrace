import { Request, Response, NextFunction } from "express";
import TeamMember from "../models/TeamMember";
import mongoose from "mongoose";

const authorizeTeam = (requiredRole: "owner" | "member") => {
  return async (
    req: Request<{ teamId: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    const userId = req.user.userId;
    const teamId = req.params.teamId;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({
        message: "Invalid team ID",
      });
    }

    try {
      const membership = await TeamMember.findOne({
        userId,
        teamId,
      });

      if (!membership) {
        return res.status(403).json({
          message: "You are not a member of this team..",
        });
      }

      if (requiredRole === "owner" && membership.role !== "owner") {
        return res.status(403).json({
          message: "You are not allowed!",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authorizeTeam;
