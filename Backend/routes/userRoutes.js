import express from "express";

import {
  getAllUsers,
  deleteUser,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  adminOnly,
  getAllUsers
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteUser
);

export default router;