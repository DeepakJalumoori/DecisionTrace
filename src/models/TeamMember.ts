import mongoose, { Types } from "mongoose";

interface ITeamMember {
  userId: Types.ObjectId;
  teamId: Types.ObjectId;
  role: "owner" | "member";
}

const teamMemberSchema = new mongoose.Schema<ITeamMember>(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teamId: {
      type: mongoose.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "member"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

teamMemberSchema.index({ userId: 1, teamId: 1 }, { unique: true });

const TeamMember = mongoose.model<ITeamMember>("TeamMember", teamMemberSchema);

export default TeamMember;
