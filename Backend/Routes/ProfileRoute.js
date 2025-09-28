const express = require('express');
const router = express.Router();
const {
  getProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile
} = require('../Controllers/ProfileControllers');

// Routes
router.get('/', getProfiles);             // Get all profiles
router.get('/:id', getProfileById);       // Get profile by ID
router.post('/', createProfile);          // Create profile
router.put('/:id', updateProfile);        // Update profile
router.delete('/:id', deleteProfile);     // Delete profile

module.exports = router;
