import mongoose from "mongoose";
import { Env } from "./env.config";

const connectDB = async () => {
  try {
    await mongoose.connect(Env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Database connection error", error);
    process.exit(1);
  }
};

export default connectDB;