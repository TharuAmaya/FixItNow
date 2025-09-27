const SupplierProfile = require("../Model/SupplierProfileModelT");

// Get supplier profile
exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = id ? 
      await SupplierProfile.findById(id) : 
      await SupplierProfile.findOne();
    
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    
    res.json(profile);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: err.message });
  }
};

// Create new supplier profile
exports.createProfile = async (req, res) => {
  try {
    console.log('Creating profile with data:', req.body);
    
    // Auto-generate supId if not provided
    if (!req.body.supId) {
      const timestamp = Date.now().toString();
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      req.body.supId = `SUP${timestamp.slice(-6)}${randomNum}`;
    }
    
    console.log('Profile data with supId:', req.body);
    const newProfile = new SupplierProfile(req.body);
    const savedProfile = await newProfile.save();
    console.log('Profile created successfully:', savedProfile);
    res.status(201).json(savedProfile);
  } catch (err) {
    console.error('Error creating profile:', err);
    
    // Handle duplicate supId error
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: 'Supplier ID already exists. Please try again.', 
        error: 'Duplicate supId' 
      });
    }
    
    res.status(500).json({ message: 'Error creating profile', error: err.message });
  }
};

// Update supplier profile
exports.updateProfile = async (req, res) => {
  try {
    console.log('Updating profile with ID:', req.params.id);
    console.log('Update data:', req.body);
    
    const updatedProfile = await SupplierProfile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    console.log('Profile updated successfully:', updatedProfile);
    res.json(updatedProfile);
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
};
