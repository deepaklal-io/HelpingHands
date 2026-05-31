import express from "express";
import { createDonation,getMyDonations,getRequestDonations } from "../controllers/donationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createDonation);

router.get(
  "/my",
  protect,
  getMyDonations
);

router.get(
  "/request/:id",
  getRequestDonations
);


export default router;