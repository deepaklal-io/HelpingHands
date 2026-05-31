import express from "express";
import {
  createRequest,
  getAllRequests,
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

router.put("/approve-test", (req, res) => {
  res.json({
    message: "Approve route working"
  });
});

router.put(
  "/:id/approve",
  protect,
  adminOnly,
  approveRequest
);

router.put(
  "/:id/reject",
  protect,
  adminOnly,
  rejectRequest
);
router.get("/approved",getApprovedRequests);

router.post("/", protect, createRequest);
router.get("/my", protect, getMyRequests);
router.get("/", getAllRequests);
router.get("/:id", getRequestById);

router.put("/:id", updateRequest);

router.delete("/:id", deleteRequest);


export default router;