import mongoose, { Types } from "mongoose";

interface ITeam {
  name: string;
  ownerId: Types.ObjectId;
}

const teamSchema = new mongoose.Schema<ITeam>(
  {
    name: {
      type: String,
      required: true,
    },
    ownerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

teamSchema.index({ ownerId: 1, name: 1 }, { unique: true });

const Team = mongoose.model<ITeam>("Team", teamSchema);

export default Team;
