const express = require('express');
const router = express.Router();
const Disaster = require('../models/Disaster');
const {
  updateGDACSData,
  getDisasters,
  getDisasterStats
} = require('../controllers/disasterController');

// Get all disasters
router.get('/', async (req, res) => {
  try {
    const disasters = await Disaster.find()
      .sort({ date: -1 }) // Most recent first
      .limit(1000); // Limit to prevent overloading
    res.json(disasters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get disasters within a specific area
router.get('/area', async (req, res) => {
  const { lat, lng, radius } = req.query; // radius in kilometers

  try {
    const disasters = await Disaster.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseFloat(radius) * 1000 // Convert to meters
        }
      }
    });
    res.json(disasters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new disaster
router.post('/', async (req, res) => {
  const disaster = new Disaster({
    type: req.body.type,
    location: {
      type: 'Point',
      coordinates: [req.body.longitude, req.body.latitude]
    },
    severity: req.body.severity,
    description: req.body.description,
    affectedArea: req.body.affectedArea,
    casualties: req.body.casualties,
    status: req.body.status
  });

  try {
    const newDisaster = await disaster.save();
    res.status(201).json(newDisaster);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to manually trigger GDACS data update
router.post('/update-gdacs', updateGDACSData);

// Route to get disasters with optional filtering
router.get('/disasters', getDisasters);

// Route to get disaster statistics
router.get('/disaster-stats', getDisasterStats);

module.exports = router; 