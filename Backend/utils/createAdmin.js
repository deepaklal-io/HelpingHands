import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../.env") });

const createAdmin = async () => {
  const mongoUrl = process.env.MONGO_URL || process.env.MONGO_URI;
  await mongoose.connect(mongoUrl);

  const existing = await User.findOne({ email: "admin@helpinghands.com" });
  if (existing) {
    console.log("Admin already exists!");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await User.create({
    name: "Admin",
    email: "admin@helpinghands.com",
    password: hashedPassword,
    role: "admin",
    isVerified: true,
  });

  console.log("✅ Admin created successfully!");
  console.log("Email: admin@helpinghands.com");
  console.log("Password: admin123");
  process.exit();
};

createAdmin();