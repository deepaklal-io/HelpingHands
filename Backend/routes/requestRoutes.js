import express from "express";
import {
  createRequest,
  getAllRequests,
  getFeaturedRequests,
  getMyRequests,
  getRequestById,
  getApprovedRequests,
  approveRequest,
  rejectRequest,
  updateRequest,
  deleteRequest,
} from "../controllers/requestController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Admin actions
router.patch("/:id/approve", protect, adminOnly, approveRequest);
router.patch("/:id/reject",  protect, adminOnly, rejectRequest);

// Student routes
router.post(
  "/",
  protect,
  upload.array("documents", 5),
  createRequest
);
router.get("/featured", getFeaturedRequests);
router.get("/my",   protect, getMyRequests);
router.put("/:id",  protect, updateRequest);
router.delete("/:id", protect, deleteRequest);

// Public / shared routes
router.get("/approved", getApprovedRequests);
router.get("/",    getAllRequests);
router.get("/:id", getRequestById);

export default router;