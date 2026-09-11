import { Request, Response } from "express";
import { transcriptSchema } from "../validators/transcript.validator";
import crypto from "crypto";
import Transcript from "../models/Transcript";
import mongoose from "mongoose";
import { extractionSchema } from "../validators/extraction.validator";
import { extractDecisions } from "../services/llm/groq";
import Decision from "../models/Decision";
import User from "../models/User";

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

  try {
    const transcript = await Transcript.create({
      teamId,
      content,
      sourceHash,
    });

    const extracted = await extractDecisions(content);
    const validation = extractionSchema.safeParse(extracted);

    if (!validation.success) {
      return res.status(500).json({
        message: "Invalid extraction result",
      });
    }

    const createdDecisions = [];
    for (const decision of validation.data.decisions) {
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
      const createdDecision = await Decision.create({
        teamId,
        transcriptId: transcript._id,
        title: decision.title,
        description: decision.description,
        owner: owner?._id,
        dueDate: decision.dueDate ? new Date(decision.dueDate) : undefined,
        confidence: decision.confidence,
        status: "open",
      });

      createdDecisions.push(createdDecision);
    }

    return res.status(201).json({
      message: "Transcript processed successfully!",
      transcript,
      decisions: createdDecisions,
    });
  } catch (error) {
    return res.status(500).json({
      message: "unexpected error..",
    });
  }
};
