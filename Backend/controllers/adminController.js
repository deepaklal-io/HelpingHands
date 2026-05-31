import User from "../models/User.js";
import HelpRequest from "../models/HelpRequest.js";
import Donation from "../models/Donation.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalRequests =
      await HelpRequest.countDocuments();

    const pendingRequests =
      await HelpRequest.countDocuments({
        status: "pending",
      });

    const approvedRequests =
      await HelpRequest.countDocuments({
        status: "approved",
      });

    const rejectedRequests =
      await HelpRequest.countDocuments({
        status: "rejected",
      });

    const completedRequests =
      await HelpRequest.countDocuments({
        status: "completed",
      });

    const donations =
      await Donation.find();

    const totalDonations =
      donations.reduce(
        (sum, donation) =>
          sum + donation.amount,
        0
      );

    res.status(200).json({
      totalUsers,
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      completedRequests,
      totalDonations,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};