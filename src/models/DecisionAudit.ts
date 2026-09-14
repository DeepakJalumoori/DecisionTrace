import mongoose, { Types } from "mongoose";

interface IDecisionAudit {
  decisionId: Types.ObjectId;
  action: "created" | "updated" | "status_changed" | "owner_changed";
  oldValue?: string;
  newValue?: string;
  changedBy: Types.ObjectId;
}

const decisionAuditSchema = new mongoose.Schema<IDecisionAudit>(
  {
    decisionId: {
      type: mongoose.Types.ObjectId,
      ref: "Decision",
      required: true,
    },
    action: {
      type: String,
      enum: ["created", "updated", "status_changed", "owner_changed"],
      required: true,
    },
    oldValue: {
      type: String,
    },
    newValue: {
      type: String,
    },
    changedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

decisionAuditSchema.index({ decisionId: 1 });

const DecisionAudit = mongoose.model<IDecisionAudit>(
  "DecisionAudit",
  decisionAuditSchema,
);

export default DecisionAudit;
