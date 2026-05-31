import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import requestRoutes from "./routes/requestRoutes.js";
import connectionDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const startServer = async () => {
  try {
    await connectionDB();

    app.use("/api/requests", requestRoutes);
    app.use("/api/auth", authRoutes);

    app.get("/", (req, res) => {
      res.send("Welcome to Helping Hands API");
    });

    const PORT = process.env.PORT || 4500;
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();