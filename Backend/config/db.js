import mongoose from "mongoose";

let connectionPromise = null;

const connectionDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const mongoUrl = process.env.MONGO_URI || process.env.MONGO_URL;

  if (!mongoUrl) {
    throw new Error("MONGO_URI (or MONGO_URL) is not defined in environment variables");
  }

  connectionPromise = mongoose.connect(mongoUrl, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    maxPoolSize: 10,
  });

  try {
    await connectionPromise;
    console.log("MongoDB connected successfully");
    return mongoose.connection;
  } catch (error) {
    connectionPromise = null;
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectionDB;