const Disaster = require('../models/Disaster');
const { fetchGDACSData } = require('../services/gdacsService');

// Fetch and update disasters from GDACS
const updateGDACSData = async (req, res) => {
  try {
    const gdacsData = await fetchGDACSData();
    
    // Bulk upsert the data
    const operations = gdacsData.map(disaster => ({
      updateOne: {
        filter: {
          type: disaster.type,
          'location.coordinates': disaster.location.coordinates,
          date: disaster.date
        },
        update: { $set: disaster },
        upsert: true
      }
    }));

    if (operations.length > 0) {
      await Disaster.bulkWrite(operations);
    }

    res.json({ message: `Updated ${operations.length} disasters from GDACS` });
  } catch (error) {
    console.error('Error updating GDACS data:', error);
    res.status(500).json({ error: 'Failed to update GDACS data' });
  }
};

// Get all disasters with optional filtering
const getDisasters = async (req, res) => {
  try {
    const { type, alertLevel, days } = req.query;
    
    // Build query based on filters
    const query = {};
    
    if (type) {
      query.type = type;
    }
    
    if (alertLevel) {
      query.alertLevel = alertLevel;
    }
    
    if (days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(days));
      query.date = { $gte: daysAgo };
    }

    const disasters = await Disaster.find(query)
      .sort({ date: -1 })
      .limit(100);

    res.json(disasters);
  } catch (error) {
    console.error('Error fetching disasters:', error);
    res.status(500).json({ error: 'Failed to fetch disasters' });
  }
};

// Get disaster statistics
const getDisasterStats = async (req, res) => {
  try {
    const stats = await Disaster.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgSeverity: { $avg: '$severity' },
          byAlertLevel: {
            $push: {
              alertLevel: '$alertLevel',
              severity: '$severity'
            }
          }
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    console.error('Error fetching disaster statistics:', error);
    res.status(500).json({ error: 'Failed to fetch disaster statistics' });
  }
};

module.exports = {
  updateGDACSData,
  getDisasters,
  getDisasterStats
}; 