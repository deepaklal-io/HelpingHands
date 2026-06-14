import HelpRequest from "../models/HelpRequest.js";
import { cloudinary } from "../middleware/uploadMiddleware.js";

const requestPopulate = "studentId";

const sendRequestNotFound = (res) =>
  res.status(404).json({ message: "Request not found" });

export const createRequest = async (req, res) => {
  try {
    const {
      title, description, category, amountNeeded,
      accountTitle, accountNumber, bankName,
      challanImageBase64, // ← base64 string from frontend
    } = req.body;

    let challanImage = null;

    // Upload to Cloudinary if image provided
    if (challanImageBase64) {
      const uploadResult = await cloudinary.uploader.upload(challanImageBase64, {
        folder: "helping-hands/challans",
        resource_type: "auto",
      });
      challanImage = uploadResult.secure_url;
    }

    if (!challanImage) {
      return res.status(400).json({
        message: "Fee challan image is required.",
      });
    }

    const request = await HelpRequest.create({
      title, description, category, amountNeeded,
      studentId: req.user._id,
      challanImage,
      bankAccount: {
        accountTitle: accountTitle || "",
        accountNumber: accountNumber || "",
        bankName: bankName || "",
      },
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const requests = await HelpRequest.find()
      .populate(requestPopulate, "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addRequestUpdate = async (req, res) => {
  try {
    const { text } = req.body;

    const request = await HelpRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Only the owner can post updates
    if (request.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Update text is required" });
    }

    request.updates.push({ text: text.trim() });
    await request.save();

    res.status(201).json({ message: "Update posted successfully", updates: request.updates });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const rejectRequest = async (req, res) => {
  try {
    const request = await HelpRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "rejected";
    request.rejectionReason = req.body.reason || "No reason provided"; // ← add this

    await request.save();
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeaturedRequests = async (req, res) => {
  try {
    const requests = await HelpRequest.find({ status: "approved" })
      .populate(requestPopulate, "name email role")
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const requests = await HelpRequest.find({ studentId: req.user._id })
      .populate(requestPopulate, "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRequestById = async (req, res) => {
  try {
    const request = await HelpRequest.findById(req.params.id).populate(
      requestPopulate,
      "name email role"
    );

    if (!request) {
      return sendRequestNotFound(res);
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApprovedRequests = async (req, res) => {
  try {
    const requests = await HelpRequest.find({ status: "approved" })
      .populate(requestPopulate, "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveRequest = async (req, res) => {
  try {
    const request = await HelpRequest.findById(req.params.id);

    if (!request) {
      return sendRequestNotFound(res);
    }

    request.status = "approved";
    await request.save();

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const request = await HelpRequest.findById(req.params.id);

    if (!request) {
      return sendRequestNotFound(res);
    }

    request.status = "rejected";
    await request.save();

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRequest = async (req, res) => {
  try {
    const request = await HelpRequest.findById(req.params.id);

    if (!request) {
      return sendRequestNotFound(res);
    }

    const isOwner = request.studentId.toString() === req.user._id.toString();
    const isAdmin = req.user?.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const fields = [
      "title",
      "description",
      "category",
      "amountNeeded",
      "challanImage",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        request[field] = req.body[field];
      }
    });

    if (req.body.accountTitle !== undefined || req.body.accountNumber !== undefined || req.body.bankName !== undefined) {
      request.bankAccount = {
        accountTitle: req.body.accountTitle ?? request.bankAccount?.accountTitle ?? "",
        accountNumber: req.body.accountNumber ?? request.bankAccount?.accountNumber ?? "",
        bankName: req.body.bankName ?? request.bankAccount?.bankName ?? "",
      };
    }

    await request.save();

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const request = await HelpRequest.findById(req.params.id);

    if (!request) {
      return sendRequestNotFound(res);
    }

    const isOwner = request.studentId.toString() === req.user._id.toString();
    const isAdmin = req.user?.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await request.deleteOne();

    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};