const SupplierProfile = require("../Model/SupplierProfileModelT");

// Get supplier profile
exports.getProfile = async (req, res) => {
  try {
    const profile = await SupplierProfile.findOne();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new supplier profile
exports.createProfile = async (req, res) => {
  try {
    const newProfile = new SupplierProfile(req.body);
    await newProfile.save();
    res.json(newProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update supplier profile
exports.updateProfile = async (req, res) => {
  try {
    const updatedProfile = await SupplierProfile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
