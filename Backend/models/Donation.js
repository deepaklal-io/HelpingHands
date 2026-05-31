import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HelpRequest",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },


  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Donation",
  donationSchema
);