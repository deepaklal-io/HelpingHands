import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

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