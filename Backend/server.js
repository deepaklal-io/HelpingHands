import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectionDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4500;
const allowedOrigins = [
  "https://helping-hands-iba.vercel.app",
  /^http:\/\/localhost:\d+$/,
  /^http:\/\/127\.0\.0\.1:\d+$/,
];

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some((allowedOrigin) =>
      allowedOrigin instanceof RegExp ? allowedOrigin.test(origin) : allowedOrigin === origin
    );

    return callback(null, isAllowed);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options(/.*/, cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const startServer = async () => {
  try {
    await connectionDB();
    console.log("DB ready");

    if (!process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error(error);
  }
};

startServer();

// Routes
app.use("/api/requests", requestRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Helping Hands API");
});

// For Vercel serverless
export default app;