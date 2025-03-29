const mongoose = require('mongoose');

const disasterSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['EQ', 'TC', 'FL', 'VO', 'DR', 'WF'] // GDACS event types
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      index: '2dsphere'
    }
  },
  date: {
    type: Date,
    required: true
  },
  alertLevel: {
    type: String,
    enum: ['Red', 'Orange', 'Green'],
    required: true
  },
  severity: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  source: {
    type: String,
    required: true,
    default: 'GDACS'
  },
  // Event-specific fields
  magnitude: Number,      // For earthquakes
  wind_speed: Number,     // For tropical cyclones
  affected_area: Number,  // For floods
  // Additional metadata
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Index for geospatial queries
disasterSchema.index({ location: '2dsphere' });

// Index for date-based queries
disasterSchema.index({ date: -1 });

module.exports = mongoose.model('Disaster', disasterSchema); 