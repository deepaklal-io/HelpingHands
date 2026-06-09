import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import donationRoutes from "./routes/donationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import connectionDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://helping-hands-frontend.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://helping-hands-frontend.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Helping Hands API");
});

app.use("/api/requests", requestRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

// Connect DB after the API is mounted so the server still responds even if
// the database handshake fails.
const initApp = async () => {
  try {
    await connectionDB();
  } catch (err) {
    console.error("Backend started without MongoDB:", err.message);
  }
};

initApp().catch((err) => {
  console.error("Failed to initialize app:", err.message);
});

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4500;
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
}

// For Vercel serverless — must export app
export default app;