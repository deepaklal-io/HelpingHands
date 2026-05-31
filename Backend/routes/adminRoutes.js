import express from "express";

import { getAdminStats }
from "../controllers/adminController.js";

import { protect }
from "../middleware/authMiddleware.js";

import { adminOnly }
from "../middleware/adminMiddleware.js";

const router = express.Router();
router.get("/test", (req, res) => {
  res.json({
    message: "Admin route working"
  });
});
router.get(
  "/stats",
  protect,
  adminOnly,
  getAdminStats
);

export default router;