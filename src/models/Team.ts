import mongoose from "mongoose";

interface ITeam {
  name: string;
}

const teamSchema = new mongoose.Schema<ITeam>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Team = mongoose.model<ITeam>("Team", teamSchema);

export default Team;
