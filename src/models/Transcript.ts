import mongoose, { Types } from "mongoose";

interface ITranscript {
  teamId: Types.ObjectId;
  content: string;
  sourceHash: string;
}

const transcriptSchema = new mongoose.Schema<ITranscript>(
  {
    teamId: {
      type: mongoose.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    sourceHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Transcript = mongoose.model<ITranscript>("Transcript", transcriptSchema);

export default Transcript;
