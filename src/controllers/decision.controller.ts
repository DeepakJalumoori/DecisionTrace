import { Request, Response } from "express";
import Decision from "../models/Decision";
import mongoose from "mongoose";
import TeamMember from "../models/TeamMember";
import DecisionAudit from "../models/DecisionAudit";

const resolveDecision = async (
  req: Request<{ decisionId: string }>,
  res: Response,
) => {
  const { decisionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(decisionId)) {
    return res.status(400).json({
      message: "Invalid Decision ID..",
    });
  }
  const session = await mongoose.startSession();
  let transactionStarted = false;

  try {
    const decision = await Decision.findById(decisionId);

    if (!decision) {
      return res.status(404).json({
        message: "Decision not found!",
      });
    }

    const membership = await TeamMember.findOne({
      userId: req.user.userId,
      teamId: decision.teamId,
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this team.",
      });
    }

    const oldStatus = decision.status;

    if (decision.status === "closed") {
      return res.status(409).json({
        message: "Decision is already closed!",
      });
    }
    session.startTransaction();
    transactionStarted = true;
    decision.status = "closed";

    await decision.save({ session });
    await DecisionAudit.create(
      [
        {
          decisionId: decision._id,
          action: "status_changed",
          oldValue: oldStatus,
          newValue: decision.status,
          changedBy: req.user.userId,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    return res.status(200).json({
      message: "Decision Status updated.",
      decision,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    return res.status(500).json({
      message: "Failed to resolve decision",
    });
  } finally {
    await session.endSession();
  }
};

export default resolveDecision;
