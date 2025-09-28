const Request = require('../Model/RequestModel');

// Get all requests
const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate("user", "name");
    res.status(200).json({ requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching requests" });
  }
};

// Add request
const addRequest = async (req, res) => {
  const { requestId, user, address, problemType, description } = req.body;
  if (!requestId || !user || !address || !problemType) {
    return res.status(400).json({ message: "All required fields must be provided" });
  }

  try {
    const newRequest = new Request({ requestId, user, address, problemType, description });
    await newRequest.save();
    const populated = await newRequest.populate('user', 'name gmail');

    // Return updated list
    const requests = await Request.find().populate("user", "name gmail");
    res.status(201).json({ requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get request by ID
const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate("user", "name");
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.status(200).json({ request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching request" });
  }
};

// Update request
const updateRequest = async (req, res) => {
  try {
    const { address, problemType, description } = req.body;
    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      { address, problemType, description },
      { new: true }
    ).populate("user", "name gmail");

    if (!updated) return res.status(404).json({ message: "Unable to update request" });
    res.status(200).json({ request: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating request" });
  }
};

// Delete request
const deleteRequest = async (req, res) => {
  try {
    const deleted = await Request.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Unable to delete request" });
    res.status(200).json({ message: "Request deleted", request: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting request" });
  }
};

// ✅ Export all at once
module.exports = { getAllRequests, addRequest, getRequestById, updateRequest, deleteRequest };
