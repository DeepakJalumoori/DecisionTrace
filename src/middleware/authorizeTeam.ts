import { Request, Response, NextFunction } from "express";
import TeamMember from "../models/TeamMember";

const authorizeTeam = (requiredRole: "owner" | "member") => {
  return async (
    req: Request<{ teamId: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    const userId = req.user.userId;
    const teamId = req.params.teamId;

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
