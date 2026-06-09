import mongoose from "mongoose";

const connectionDB = async () => {
  const mongoUrl = process.env.MONGO_URL || process.env.MONGO_URI;

  if (!mongoUrl) {
    throw new Error("MONGO_URL (or MONGO_URI) is not defined in the environment");
  }

  try {
    await mongoose.connect(mongoUrl);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectionDB;