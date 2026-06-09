import mongoose from "mongoose";

const helpRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    amountNeeded: {
      type: Number,
      required: true,
    },
    receivedAmount: {
  type: Number,
  default: 0,
},

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
    documents: [
  {
    type: String,
  },
],


    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const HelpRequest = mongoose.model(
  "HelpRequest",
  helpRequestSchema
);

export default HelpRequest;