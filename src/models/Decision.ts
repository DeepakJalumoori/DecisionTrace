import mongoose, { Types } from "mongoose";

interface IDecision {
  teamId: Types.ObjectId;
  transcriptId: Types.ObjectId;
  title: string;
  description: string;
  owner?: Types.ObjectId;
  dueDate?: Date;
  confidence: number;
  status: "open" | "closed";
}

const decisionSchema = new mongoose.Schema<IDecision>(
  {
    teamId: {
      type: mongoose.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    transcriptId: {
      type: mongoose.Types.ObjectId,
      ref: "Transcript",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    dueDate: {
      type: Date,
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

decisionSchema.index({ teamId: 1 });
decisionSchema.index({ transcriptId: 1 });

const Decision = mongoose.model<IDecision>("Decision", decisionSchema);

export default Decision;
