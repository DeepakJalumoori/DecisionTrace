import Team from "../models/Team";
import TeamMember from "../models/TeamMember";
import mongoose from "mongoose";
import Decision from "../models/Decision";

import { Request, Response } from "express";
import User from "../models/User";

export const createTeam = async (req: Request, res: Response) => {
  const { name } = req.body;
  const userId = req.user.userId;

  try {
    const team = await Team.create({ name, ownerId: userId });

    await TeamMember.create({
      userId,
      teamId: team._id,
      role: "owner",
    });

    res.status(201).json({
      message: "Team created successfully!",
      team: {
        teamId: team._id,
      },
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return res.status(409).json({
        message: "You already have a team with this name.",
      });
    }

    return res.status(500).json({
      message: "Unexpected Error!",
    });
  }
};

export const getTeams = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;
    const memberships = await TeamMember.find({ userId });

    const teamIds = memberships.map((membership) => membership.teamId);

    const teams = await Team.find({
      _id: { $in: teamIds },
    });

    return res.status(200).json({
      teams,
    });
  } catch (error) {
    return res.status(500).json({
      message: "unexpected Error!",
    });
  }
};

export const addTeamMember = async (
  req: Request<{ teamId: string }>,
  res: Response,
) => {
  const teamId = req.params.teamId;
  const memberEmail = req.body.email;

  try {
    const targetUser = await User.findOne({ email: memberEmail });

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const existingMembership = await TeamMember.findOne({
      userId: targetUser._id,
      teamId,
    });

    if (existingMembership) {
      return res.status(409).json({
        message: "User is already a member of this team.",
      });
    }

    await TeamMember.create({
      userId: targetUser._id,
      teamId,
      role: "member",
    });

    return res.status(201).json({
      message: "Member added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "unexpected error..",
    });
  }
};

export const getTeamDecisions = async (
  req: Request<{ teamId: string }>,
  res: Response,
) => {
  const teamId = req.params.teamId;

  try {
    const decisions = await Decision.find({ teamId });

    return res.status(200).json({
      decisions,
    });
  } catch (error) {
    return res.status(500).json({
      message: "unexpected error..",
    });
  }
};
