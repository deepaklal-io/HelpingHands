import mongoose from "mongoose";

const connectionDB = async () => {
  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is not defined in .env");
  }

  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectionDB;