const express = require('express');
const router = express.Router();
const Request = require('../Model/RequestModel');

// GET all requests
router.get('/', async (req, res) => {
  try {
    const requests = await Request.find();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE request
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Request.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE request
router.put('/:id', async (req, res) => {
  try {
    const { address, problemType, description } = req.body;

    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.address = address;
    request.problemType = problemType;
    request.description = description;

    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
