import Donation from "../models/Donation.js";
import HelpRequest from "../models/HelpRequest.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const createDonation = async (req, res) => {
  try {
    const { requestId, amount, paymentProofBase64, message } = req.body;

    const request = await HelpRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.studentId.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: "You cannot donate to your own request" });
    }

    if (request.status !== "approved") {
      return res.status(400).json({ message: "Only approved requests can receive donations" });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Donation amount must be greater than 0" });
    }

    const remainingAmount = request.amountNeeded - request.receivedAmount;

    if (amount > remainingAmount) {
      return res.status(400).json({ message: `Maximum donation allowed is PKR ${remainingAmount}` });
    }

    // ✅ Upload payment proof to Cloudinary
    let paymentProof = null;
    if (paymentProofBase64) {
      const uploadResult = await cloudinary.uploader.upload(paymentProofBase64, {
        folder: "helping-hands/payment-proofs",
        resource_type: "auto",
      });
      paymentProof = uploadResult.secure_url;
    }

    const donation = await Donation.create({
      donorId: req.user._id,
      requestId,
      amount,
      paymentProof,
      message: message || "",
    });

    request.receivedAmount += Number(amount);

    if (request.receivedAmount >= request.amountNeeded) {
      request.status = "completed";
    }

    await request.save();

    const updatedRequest = await HelpRequest.findById(requestId);

    res.status(201).json({
      message: "Donation successful",
      donation,
      request: updatedRequest,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      donorId: req.user._id,
    }).populate("requestId", "title status amountNeeded receivedAmount");

    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getRequestDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      requestId: req.params.id,
    }).populate("donorId", "name email");

    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
