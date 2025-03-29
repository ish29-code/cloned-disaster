const axios = require('axios');

// GDACS API endpoints
const GDACS_FEED_URL = 'https://www.gdacs.org/xml/rss.xml';
const GDACS_REST_API = 'https://www.gdacs.org/REST/api';

// Mapping GDACS alert levels to intensity values
const alertLevelToIntensity = {
  'Red': 1.0,    // Severe impact, high intensity
  'Orange': 0.7, // Medium impact
  'Green': 0.4   // Low impact
};

const fetchGDACSData = async () => {
  try {
    // Fetch GDACS RSS feed for recent disasters
    const response = await axios.get(GDACS_FEED_URL);
    const events = response.data.items || [];

    // Transform GDACS data to our format
    const formattedData = events.map(event => ({
      type: event.eventtype,
      location: {
        coordinates: [
          parseFloat(event.longitude),
          parseFloat(event.latitude)
        ]
      },
      date: new Date(event.pubDate),
      alertLevel: event.alertlevel,
      severity: calculateSeverity(event),
      title: event.title,
      description: event.description,
      source: 'GDACS',
      // Additional fields specific to event types
      magnitude: event.eventtype === 'EQ' ? parseFloat(event.magnitude) : null,
      wind_speed: event.eventtype === 'TC' ? parseFloat(event.wind_speed) : null,
      affected_area: event.eventtype === 'FL' ? parseFloat(event.affected_area) : null
    }));

    return formattedData;
  } catch (error) {
    console.error('Error fetching GDACS data:', error);
    return [];
  }
};

const calculateSeverity = (event) => {
  // Calculate severity based on GDACS alert level and event type
  const baseIntensity = alertLevelToIntensity[event.alertlevel] || 0.3;
  
  let multiplier = 1;
  switch (event.eventtype) {
    case 'EQ': // Earthquake
      multiplier = event.magnitude ? Math.min(event.magnitude / 10, 1) : 1;
      break;
    case 'TC': // Tropical Cyclone
      multiplier = event.wind_speed ? Math.min(event.wind_speed / 200, 1) : 1;
      break;
    case 'FL': // Flood
      multiplier = event.affected_area ? Math.min(event.affected_area / 10000, 1) : 1;
      break;
    default:
      multiplier = 0.7;
  }

  return Math.min(baseIntensity * multiplier, 1);
};

module.exports = {
  fetchGDACSData
}; 