import HelpRequest from "../models/HelpRequest.js";

export const createRequest = async (req, res) => {
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
      studentId: "683a00000000000000000001",
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
    const requests = await HelpRequest.find();

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};