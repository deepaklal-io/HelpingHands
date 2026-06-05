import HelpRequest from "../models/HelpRequest.js";

export const createRequest = async (req, res) => {
  console.log(req.user);
  try {
    
    const {
      title,
      description,
      category,
      amountNeeded,
    } = req.body;

    const request = await HelpRequest.create({
      title,
      description,
      category,
      amountNeeded,
      studentId: req.user._id,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getAllRequests = async (req, res) => {
  try {
    const requests = await HelpRequest.find()
      .populate("studentId", "name email");  // ← add this line
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRequest = async (req, res) => {
  try {

    const request = await HelpRequest.findById(
      req.params.id
    );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (
      request.studentId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const updatedRequest =
      await HelpRequest.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.status(200).json(updatedRequest);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteRequest = async (req, res) => {
  try {

    const request = await HelpRequest.findById(
      req.params.id
    );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (
      request.studentId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await request.deleteOne();

    res.status(200).json({
      message:
        "Request deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getMyRequests = async (req, res) => {
  try {
    const requests = await HelpRequest.find({
      studentId: req.user._id,
    });

    res.status(200).json(requests);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const approveRequest = async (req, res) => {
  try {

    const request = await HelpRequest.findById(
      req.params.id
    );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    request.status = "approved";

    await request.save();

    res.status(200).json(request);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const rejectRequest = async (req, res) => {
  try {

    const request = await HelpRequest.findById(
      req.params.id
    );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    request.status = "rejected";

    await request.save();

    res.status(200).json(request);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getApprovedRequests = async (req, res) => {
  try {

    const requests = await HelpRequest.find({
      status: "approved",
    });

    res.status(200).json(requests);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getRequestById = async (req, res) => {
  try {
    const request = await HelpRequest.findById(
      req.params.id
    ).populate(
      "studentId",
      "name email"
    );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    res.status(200).json(request);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};