const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');

const router = express.Router();

// GDACS RSS feed URL
const GDACS_FEED_URL = 'https://www.gdacs.org/xml/rss.xml';

// Get latest disasters from GDACS
router.get('/', async (req, res) => {
  try {
    console.log("Fetching GDACS data from:", GDACS_FEED_URL);
    const response = await axios.get(GDACS_FEED_URL);
    const parser = new xml2js.Parser({ explicitArray: false });
    
    const result = await parser.parseStringPromise(response.data);
    console.log("XML parsed successfully");
    
    // Check the structure of the parsed XML data
    if (!result.rss || !result.rss.channel || !result.rss.channel.item) {
      console.log("Invalid XML structure:", JSON.stringify(result, null, 2).substring(0, 500) + "...");
      // Return mock data instead
      return res.json(getMockDisasterData());
    }
    
    let items = result.rss.channel.item;
    // Ensure items is an array even if there's only one item
    if (!Array.isArray(items)) {
      items = [items];
    }
    
    console.log(`Found ${items.length} disaster items`);
    
    // Process the real GDACS data
    const realDisasters = items.map((item, index) => processDisasterItem(item, index)).filter(item => item !== null);
    
    // Add some mock Red and Orange alerts for demonstration
    const mockDisasters = getMockAlertData();
    
    // Combine real and mock data
    const combined = [...realDisasters, ...mockDisasters];
    
    console.log(`Processed ${realDisasters.length} real disasters and added ${mockDisasters.length} mock disasters`);
    console.log(`Final data has Red alerts: ${combined.filter(d => d.alertLevel === 'Red').length}, Orange alerts: ${combined.filter(d => d.alertLevel === 'Orange').length}, Green alerts: ${combined.filter(d => d.alertLevel === 'Green').length}`);
    
    res.json(combined);
  } catch (error) {
    console.error('Error fetching GDACS data:', error);
    res.json(getMockDisasterData());
  }
});

// New route to get raw GDACS data for debugging
router.get('/raw-gdacs', async (req, res) => {
  try {
    console.log("Fetching raw GDACS data");
    const response = await axios.get(GDACS_FEED_URL);
    const parser = new xml2js.Parser({ explicitArray: false });
    
    const result = await parser.parseStringPromise(response.data);
    console.log("XML parsed successfully");
    
    if (!result.rss || !result.rss.channel || !result.rss.channel.item) {
      return res.status(500).json({ error: 'Invalid GDACS data structure' });
    }
    
    let items = result.rss.channel.item;
    if (!Array.isArray(items)) {
      items = [items];
    }
    
    // Just send the first 3 items for inspection
    const sampleItems = items.slice(0, 3);
    
    res.json({
      total: items.length,
      samples: sampleItems
    });
  } catch (error) {
    console.error('Error fetching raw GDACS data:', error);
    res.status(500).json({ error: 'Failed to fetch GDACS data' });
  }
});

// Helper function to process a single disaster item
function processDisasterItem(item, index) {
  try {
    // Extract coordinates from various possible locations
    let latitude = null;
    let longitude = null;
    
    // Approach 1: Try to parse from gdacs field
    if (item.gdacs) {
      if (item.gdacs.geolatitude && item.gdacs.geolongitude) {
        latitude = parseFloat(item.gdacs.geolatitude);
        longitude = parseFloat(item.gdacs.geolongitude);
      }
    }
    
    // Approach 2: Try to parse from georss:point (common in RSS feeds)
    if (!latitude && !longitude && item['georss:point']) {
      const pointParts = item['georss:point'].split(' ');
      if (pointParts.length >= 2) {
        latitude = parseFloat(pointParts[0]);
        longitude = parseFloat(pointParts[1]);
      }
    }
    
    // Approach 3: Check for point or geo fields
    if (!latitude && !longitude) {
      if (item.point && item.point.coordinates) {
        const parts = item.point.coordinates.split(',');
        if (parts.length >= 2) {
          latitude = parseFloat(parts[0]);
          longitude = parseFloat(parts[1]);
        }
      } else if (item.geo) {
        if (item.geo.lat && item.geo.long) {
          latitude = parseFloat(item.geo.lat);
          longitude = parseFloat(item.geo.long);
        }
      }
    }
    
    // Approach 4: Try to extract from description
    if ((!latitude || !longitude) && item.description) {
      const latMatch = item.description.match(/lat[:=\s]+([+-]?\d+\.\d+)/i);
      const lonMatch = item.description.match(/lon[:=\s]+([+-]?\d+\.\d+)/i);
      
      if (latMatch && latMatch[1] && lonMatch && lonMatch[1]) {
        latitude = parseFloat(latMatch[1]);
        longitude = parseFloat(lonMatch[1]);
      }
    }
    
    // If still no coordinates, use mock location for testing
    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      // For testing - use predefined locations based on event type
      const mockLocations = {
        'EQ': [139.767, 35.682], // Tokyo (Earthquake)
        'TC': [120.984, 14.599], // Manila (Tropical Cyclone)
        'FL': [100.501, 13.754], // Bangkok (Flood)
        'DR': [151.209, -33.868], // Sydney (Drought)
        'VO': [110.446, -7.541], // Mt. Merapi (Volcano)
        'default': [77, 20] // Default - India
      };
      
      const location = mockLocations[item.eventtype] || mockLocations.default;
      longitude = location[0];
      latitude = location[1];
      console.log(`Using mock location for item ${index} (${item.eventtype}): ${latitude}, ${longitude}`);
    } else {
      console.log(`Found coordinates for item ${index}: ${latitude}, ${longitude}`);
    }
    
    // Extract alert level
    let alertLevel = "Green";
    if (item.alertlevel) {
      // Normalize alertlevel to proper capitalization
      const level = item.alertlevel.toLowerCase();
      if (level.includes("red")) {
        alertLevel = "Red";
      } else if (level.includes("orange")) {
        alertLevel = "Orange";
      } else if (level.includes("green")) {
        alertLevel = "Green";
      }
    } else if (item.gdacs && item.gdacs.alertlevel) {
      // Normalize GDACS alertlevel
      const level = item.gdacs.alertlevel.toLowerCase();
      if (level.includes("red")) {
        alertLevel = "Red";
      } else if (level.includes("orange")) {
        alertLevel = "Orange";
      } else if (level.includes("green")) {
        alertLevel = "Green";
      }
    } else if (item.title) {
      // Try to extract from title as fallback
      const title = item.title.toLowerCase();
      if (title.includes("red alert")) {
        alertLevel = "Red";
      } else if (title.includes("orange alert")) {
        alertLevel = "Orange";
      } else if (title.includes("green alert")) {
        alertLevel = "Green";
      }
    }
    
    console.log(`Item ${index} alert level: ${alertLevel} (from: ${item.alertlevel || (item.gdacs ? item.gdacs.alertlevel : null) || 'title'})`);
    
    // Extract event type
    let eventType = "Unknown";
    if (item.eventtype) {
      eventType = item.eventtype;
    } else if (item.gdacs && item.gdacs.eventtype) {
      eventType = item.gdacs.eventtype;
    }
    
    // Create the disaster object
    return {
      title: item.title || "Unknown Disaster",
      description: item.description || "",
      date: item.pubDate ? new Date(item.pubDate) : new Date(),
      type: eventType,
      alertLevel: alertLevel,
      location: {
        coordinates: [
          longitude,
          latitude
        ]
      },
      severity: calculateSeverity(item)
    };
  } catch (error) {
    console.error(`Error processing disaster item ${index}:`, error);
    // Return null for this item
    return null;
  }
}

// Add mock Red and Orange alerts for demonstration
function getMockAlertData() {
  return [
    // Red alerts - major disasters
    {
      title: "Red alert: Major Earthquake in Japan",
      description: "7.8 magnitude earthquake affecting Tokyo region",
      type: "EQ",
      alertLevel: "Red",
      date: new Date(),
      location: {
        coordinates: [139.767, 35.682] // Tokyo
      },
      severity: 0.95
    },
    {
      title: "Red alert: Super Typhoon in Philippines",
      description: "Category 5 typhoon with wind speeds over 280 km/h",
      type: "TC",
      alertLevel: "Red",
      date: new Date(),
      location: {
        coordinates: [121.774, 12.879] // Philippines
      },
      severity: 0.9
    },
    {
      title: "Red alert: Catastrophic Flooding in Bangladesh",
      description: "Severe flooding affecting over 2 million people",
      type: "FL",
      alertLevel: "Red",
      date: new Date(),
      location: {
        coordinates: [90.356, 23.685] // Bangladesh
      },
      severity: 0.88
    },
    
    // Orange alerts - moderate disasters
    {
      title: "Orange alert: Volcanic Eruption in Indonesia",
      description: "Mt. Merapi eruption with ash column reaching 5km",
      type: "VO",
      alertLevel: "Orange",
      date: new Date(),
      location: {
        coordinates: [110.446, -7.541] // Mt. Merapi
      },
      severity: 0.75
    },
    {
      title: "Orange alert: Flooding in Thailand",
      description: "Monsoon flooding affecting Bangkok metropolitan area",
      type: "FL",
      alertLevel: "Orange",
      date: new Date(),
      location: {
        coordinates: [100.501, 13.754] // Bangkok
      },
      severity: 0.68
    },
    {
      title: "Orange alert: Cyclone in Madagascar",
      description: "Category 3 cyclone affecting eastern coast",
      type: "TC",
      alertLevel: "Orange",
      date: new Date(),
      location: {
        coordinates: [46.869, -18.879] // Madagascar
      },
      severity: 0.72
    },
    {
      title: "Orange alert: Earthquake in Mexico",
      description: "6.4 magnitude earthquake near Mexico City",
      type: "EQ",
      alertLevel: "Orange",
      date: new Date(),
      location: {
        coordinates: [-99.133, 19.432] // Mexico City
      },
      severity: 0.65
    }
  ];
}

// Helper function to calculate severity based on GDACS data
function calculateSeverity(item) {
  // Extract alert level
  let alertLevel = "Green";
  if (item.alertlevel) {
    // Normalize alertlevel to proper capitalization
    const level = item.alertlevel.toLowerCase();
    if (level.includes("red")) {
      alertLevel = "Red";
    } else if (level.includes("orange")) {
      alertLevel = "Orange";
    } else if (level.includes("green")) {
      alertLevel = "Green";
    }
  } else if (item.gdacs && item.gdacs.alertlevel) {
    // Normalize GDACS alertlevel
    const level = item.gdacs.alertlevel.toLowerCase();
    if (level.includes("red")) {
      alertLevel = "Red";
    } else if (level.includes("orange")) {
      alertLevel = "Orange";
    } else if (level.includes("green")) {
      alertLevel = "Green";
    }
  } else if (item.title) {
    // Try to extract from title as fallback
    const title = item.title.toLowerCase();
    if (title.includes("red alert")) {
      alertLevel = "Red";
    } else if (title.includes("orange alert")) {
      alertLevel = "Orange";
    } else if (title.includes("green alert")) {
      alertLevel = "Green";
    }
  }

  const alertLevelMap = {
    'Red': 1.0,
    'Orange': 0.7,
    'Green': 0.4
  };

  let severity = alertLevelMap[alertLevel] || 0.4;

  // Adjust severity based on event type and parameters
  if (item.eventtype === 'EQ' && item.magnitude) {
    // Earthquakes
    severity *= Math.min(parseFloat(item.magnitude) / 10, 1);
  } else if (item.eventtype === 'TC' && item.windspeed) {
    // Tropical Cyclones
    severity *= Math.min(parseFloat(item.windspeed) / 200, 1);
  } else if (item.eventtype === 'FL' && item.gdacs && item.gdacs.population && item.gdacs.severity) {
    // Floods - adjust based on population affected and GDACS severity
    const popFactor = Math.min(parseInt(item.gdacs.population.replace(/,/g, '')) / 1000000, 1) || 0.5;
    const severityFactor = Math.min(parseFloat(item.gdacs.severity) / 3, 1) || 0.5;
    severity *= (popFactor * 0.4 + severityFactor * 0.6);
  }

  return Math.min(severity, 1);
}

// Fallback mock data
function getMockDisasterData() {
  return [
    {
      title: "Earthquake in Japan",
      description: "6.5 magnitude earthquake",
      type: "EQ",
      alertLevel: "Orange",
      date: new Date(),
      location: { coordinates: [139.767, 35.682] }, // Tokyo
      severity: 0.7
    },
    {
      title: "Flooding in Thailand",
      description: "Severe flooding affecting Bangkok area",
      type: "FL",
      alertLevel: "Red",
      date: new Date(),
      location: { coordinates: [100.501, 13.754] }, // Bangkok
      severity: 0.9
    },
    {
      title: "Tropical Cyclone in Philippines",
      description: "Category 3 tropical cyclone",
      type: "TC",
      alertLevel: "Red",
      date: new Date(),
      location: { coordinates: [120.984, 14.599] }, // Manila
      severity: 0.85
    },
    {
      title: "Drought in Australia",
      description: "Ongoing drought conditions",
      type: "DR",
      alertLevel: "Green",
      date: new Date(),
      location: { coordinates: [151.209, -33.868] }, // Sydney
      severity: 0.4
    },
    {
      title: "Volcanic Activity in Indonesia",
      description: "Increased activity at Mt. Merapi",
      type: "VO",
      alertLevel: "Orange",
      date: new Date(),
      location: { coordinates: [110.446, -7.541] }, // Mt. Merapi
      severity: 0.65
    }
  ];
}

module.exports = router;
