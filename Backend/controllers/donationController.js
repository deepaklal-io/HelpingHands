  import Donation from "../models/Donation.js";
  import HelpRequest from "../models/HelpRequest.js";

  export const createDonation = async (req, res) => {
    try {
      const { requestId, amount } = req.body;

      const request = await HelpRequest.findById(requestId);

      if (!request) {
        return res.status(404).json({
          message: "Request not found",
        });
      }

      if (request.status !== "approved") {
        return res.status(400).json({
          message:
            "Only approved requests can receive donations",
        });
      }

      if (!amount || amount <= 0) {
        return res.status(400).json({
          message:
            "Donation amount must be greater than 0",
        });
      }

      if (request.status === "completed") {
        return res.status(400).json({
          message:
            "Request already completed",
        });
      }

      const remainingAmount =
        request.amountNeeded -
        request.receivedAmount;

      if (amount > remainingAmount) {
        return res.status(400).json({
          message: `Maximum donation allowed is ${remainingAmount}`,
        });
      }

      const donation = await Donation.create({
        donorId: req.user._id,
        requestId,
        amount,
      });

      request.receivedAmount += Number(amount);

      if (
        request.receivedAmount >=
        request.amountNeeded
      ) {
        request.status = "completed";
      }

      await request.save();

      const updatedRequest =
        await HelpRequest.findById(
          requestId
        );

      res.status(201).json({
        message:
          "Donation successful",
        donation,
        request: updatedRequest,
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  export const getMyDonations = async (req, res) => {
    try {
      const donations = await Donation.find({
        donorId: req.user._id,
      }).populate(
        "requestId",
        "title status amountNeeded receivedAmount"
      );

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
      }).populate(
        "donorId",
        "name email"
      );

      res.status(200).json(donations);

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };