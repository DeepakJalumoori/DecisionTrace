import mongoose from "mongoose";
import { config } from "dotenv";

config();
const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MongoDB URI is not defined.");
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      throw new Error("MongoDB connection failed");
    } else {
      throw new Error("Unknown MongoDB connection error");
    }
  }
};

export default connectDB;
