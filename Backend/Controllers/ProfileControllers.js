const Profile = require('../Model/ProfileModel');

// Get all profiles (for your current fetch)
const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.status(200).json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get a single profile by ID
const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Create a new profile
const createProfile = async (req, res) => {
  try {
    const newProfile = new Profile(req.body);
    await newProfile.save();
    res.status(201).json(newProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update a profile by ID
const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProfile = await Profile.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(updatedProfile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a profile
const deleteProfile = async (req, res) => {
  try {
    const deletedProfile = await Profile.findByIdAndDelete(req.params.id);
    if (!deletedProfile) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile
};
