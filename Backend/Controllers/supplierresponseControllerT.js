const SupplierResponse = require("../Model/supplierresponseModelT");
const Notification = require("../Model/notificationModelT");

// Add a new response
exports.addResponse = async (req, res) => {
  try {
    const { resID, orderId, responseType, notes } = req.body;

    if (!resID) {
      return res.status(400).json({ error: "Response ID is required" });
    }

    const existing = await SupplierResponse.findOne({ orderId });
    if (existing) {
      return res
        .status(400)
        .json({ error: "Response already exists for this order" });
    }

    const newResponse = new SupplierResponse({
      resID,
      orderId,
      responseType,
      notes,
    });

    await newResponse.save();

    // Create Notification for Admin
    const newNotification = new Notification({
      message: `Supplier responded to Order ${orderId} with: ${responseType}`,
    });
    await newNotification.save();

    res
      .status(201)
      .json({ message: "Response added successfully", response: newResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get all responses
exports.getResponses = async (req, res) => {
  try {
    const responses = await SupplierResponse.find();
    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete response by ID
exports.deleteResponse = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await SupplierResponse.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Response not found" });
    }

    res.json({ message: "Response deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
