import express from "express";
import {
  createRequest, getAllRequests, getMyRequests,
  getRequestById, getApprovedRequests,
  approveRequest, rejectRequest, updateRequest, deleteRequest,
} from "../controllers/requestController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.patch("/:id/approve", protect, adminOnly, approveRequest);
router.patch("/:id/reject",  protect, adminOnly, rejectRequest);

// No upload middleware here anymore
router.post(
  "/",
  protect,
  upload.array("documents", 5),
  createRequest
);
router.get("/my",   protect, getMyRequests);
router.put("/:id",  protect, updateRequest);
router.delete("/:id", protect, deleteRequest);

router.get("/approved", getApprovedRequests);
router.get("/",    getAllRequests);
router.get("/:id", getRequestById);

export default router;