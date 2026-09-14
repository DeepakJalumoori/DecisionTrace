import { Request, Response } from "express";
import { transcriptSchema } from "../validators/transcript.validator";
import crypto from "crypto";
import Transcript from "../models/Transcript";
import mongoose from "mongoose";
import { extractDecisions } from "../services/extraction.service";
import Decision from "../models/Decision";
import User from "../models/User";
import DecisionAudit from "../models/DecisionAudit";

export const createTranscript = async (
  req: Request<{ teamId: string }>,
  res: Response,
) => {
  const result = transcriptSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid transcript data",
    });
  }

  const teamId = req.params.teamId;
  if (!mongoose.Types.ObjectId.isValid(teamId)) {
    return res.status(400).json({
      message: "Invalid team ID",
    });
  }
  const content = result.data.content;
  const sourceHash = crypto.createHash("sha256").update(content).digest("hex");

  const session = await mongoose.startSession();

  try {
    const transcript = await Transcript.create({
      teamId,
      content,
      sourceHash,
    });

    const decisions = await extractDecisions(content);

    const preparedDecisions = [];

    for (const decision of decisions) {
      const owner = decision.owner
        ? await User.findOne({
            name: { $regex: `^${decision.owner}$`, $options: "i" },
          })
        : null;

      if (decision.owner && !owner) {
        return res.status(400).json({
          message: `Owner ${decision.owner} not found`,
        });
      }

      const dueDate = decision.dueDate ? new Date(decision.dueDate) : undefined;
      if (dueDate && isNaN(dueDate.getTime())) {
        return res.status(400).json({
          message: "Invalid due date in extraction result",
        });
      }

      preparedDecisions.push({
        teamId,
        transcriptId: transcript._id,
        title: decision.title,
        description: decision.description,
        owner: owner?._id,
        dueDate,
        confidence: decision.confidence,
      });
    }

    session.startTransaction();

    const createdDecisions = [];
    for (const decision of preparedDecisions) {
      const [createdDecision] = await Decision.create([decision], { session });

      await DecisionAudit.create(
        [
          {
            decisionId: createdDecision._id,
            action: "created",
            newValue: createdDecision.status,
            changedBy: req.user.userId,
          },
        ],
        { session },
      );

      createdDecisions.push(createdDecision);
    }

    await session.commitTransaction();

    return res.status(201).json({
      message: "Transcript processed successfully!",
      transcript,
      decisions: createdDecisions,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return res.status(409).json({
        message: "Transcript already exists for this team.",
      });
    }
    return res.status(500).json({
      message: "unexpected error..",
    });
  } finally {
    await session.endSession();
  }
};
