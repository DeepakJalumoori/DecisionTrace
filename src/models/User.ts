import mongoose from "mongoose";

interface Iuser {
  name: string;
  email: string;
  passwordHash: string;
}
const userSchema = new mongoose.Schema<Iuser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model<Iuser>("User", userSchema);

export default User;
