import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

const HeatMapLayer = ({ data }) => {
  const map = useMap();
  const heatLayerRef = useRef(null);

  const calculateIntensity = (disaster) => {
    try {
      // Default intensity if severity is provided
      if (typeof disaster.severity === 'number' && !isNaN(disaster.severity)) {
        return Math.min(Math.max(disaster.severity, 0), 1);
      }

      // Enhanced alert level intensity mapping for better visualization
      const alertLevelMap = {
        'Red': 1.0,    // Critical intensity - will appear as deep red
        'Orange': 0.75, // High intensity - will appear as orange-red
        'Green': 0.5,  // Moderate intensity - will appear as yellow
        'Unknown': 0.3  // Low intensity - will appear as blue-green
      };
      
      // Normalize alert level to ensure proper capitalization
      let normalizedAlertLevel = "Unknown";
      if (disaster.alertLevel) {
        const level = disaster.alertLevel.toLowerCase();
        if (level.includes("red")) {
          normalizedAlertLevel = "Red";
        } else if (level.includes("orange")) {
          normalizedAlertLevel = "Orange";
        } else if (level.includes("green")) {
          normalizedAlertLevel = "Green";
        }
      }
      
      let baseIntensity = alertLevelMap[normalizedAlertLevel] || 0.5;
      
      // Enhanced event type weighting for more visual distinction
      const eventTypeWeights = {
        'EQ': 1.3, // Earthquakes - very high weight
        'TC': 1.2, // Tropical Cyclones - high weight
        'FL': 1.1, // Floods - above average weight
        'DR': 0.9, // Droughts - below average weight
        'VO': 1.2, // Volcanoes - high weight
        'WF': 1.0, // Wildfires - average weight
        'TS': 1.1  // Tsunamis - above average weight
      };
      
      const typeMultiplier = eventTypeWeights[disaster.type] || 1.0;
      baseIntensity *= typeMultiplier;

      // Improved recency factor with logarithmic decay
      // More recent events get higher intensity, with a smoother falloff
      if (disaster.date) {
        const now = new Date();
        const eventDate = new Date(disaster.date);
        const daysDifference = Math.max(0, (now - eventDate) / (1000 * 60 * 60 * 24)); // Convert ms to days
        
        // Logarithmic decay function - slower initial decline, faster later decline
        const recencyFactor = daysDifference <= 1 
          ? 1.0 // Last 24 hours gets full intensity
          : Math.max(0.4, 1 - 0.15 * Math.log10(daysDifference + 1)); // Logarithmic decay
          
        baseIntensity *= recencyFactor;
      }

      return Math.min(Math.max(baseIntensity, 0.25), 1); // Ensure minimum visibility of 0.25
    } catch (err) {
      console.error("Error calculating intensity:", err);
      return 0.5; // Default value on error
    }
  };

  useEffect(() => {
    console.log("HeatMapLayer received data:", data?.length || 0, "items");
    if (data && data.length > 0) {
      try {
        // Log alert level distribution
        const alertLevels = {};
        data.forEach(item => {
          const level = item.alertLevel || 'Unknown';
          alertLevels[level] = (alertLevels[level] || 0) + 1;
        });
        console.log("Alert level distribution:", alertLevels);
        
        // Log a sample of items
        if (data.length > 0) {
          console.log("Sample items with alert levels:");
          for (let i = 0; i < Math.min(3, data.length); i++) {
            console.log(`Item ${i}: ${data[i].title}, Alert Level: ${data[i].alertLevel}, Type: ${data[i].type}`);
          }
        }
      } catch (err) {
        console.error("Error examining data:", err);
      }
    }
  }, [data]);

  useEffect(() => {
    if (!data || data.length === 0) {
      console.warn("No data provided to HeatMapLayer");
      return;
    }

    console.log("Creating heat map with", data.length, "points");
    
    try {
      // Clean up previous layer if it exists
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
      
      // Convert disaster data to heat map points
      let validCount = 0;
      let invalidCount = 0;
      
      const points = data
        .filter(disaster => {
          // Validate disaster object
          if (!disaster || typeof disaster !== 'object') {
            invalidCount++;
            return false;
          }
          
          // Filter out disasters without valid coordinates
          if (!disaster.location || !disaster.location.coordinates) {
            invalidCount++;
            return false;
          }
          
          const lng = disaster.location.coordinates[0];
          const lat = disaster.location.coordinates[1];
          
          const isValid = 
            typeof lng === 'number' && !isNaN(lng) && 
            typeof lat === 'number' && !isNaN(lat) &&
            lat !== 0 && lng !== 0 &&
            lat >= -90 && lat <= 90 &&
            lng >= -180 && lng <= 180;
            
          if (!isValid) {
            invalidCount++;
          } else {
            validCount++;
          }
          
          return isValid;
        })
        .map(disaster => {
          const lat = disaster.location.coordinates[1];
          const lng = disaster.location.coordinates[0];
          const intensity = calculateIntensity(disaster);
          return [lat, lng, intensity];
        });

      console.log(`Heat map filtering: ${validCount} valid points, ${invalidCount} invalid`);
      
      if (points.length === 0) {
        console.warn("No valid heat map points generated from data");
        return;
      }

      // Enhanced heat map options for better visual clarity
      const heatMapOptions = {
        radius: 45,          // Increased radius for better visibility
        blur: 35,            // More blur for smoother gradients
        maxZoom: 18,         // Allow heat map at higher zoom levels
        minOpacity: 0.6,     // Higher minimum opacity to ensure visibility
        max: 1.0,            // Maximum point intensity
        gradient: {          // Enhanced color gradient with more colors for better differentiation
          0.0: '#0099ff',   // Blue for very low intensity
          0.3: '#33ccff',   // Light blue for low intensity
          0.4: '#66ffcc',   // Teal for low-moderate intensity
          0.5: '#ffff99',   // Yellow for moderate intensity
          0.6: '#ffcc66',   // Gold for moderate-high intensity
          0.7: '#ff9933',   // Orange for high intensity
          0.8: '#ff6600',   // Dark orange for very high intensity
          0.9: '#ff3300',   // Red-orange for severe intensity
          1.0: '#cc0000'    // Deep red for extreme intensity
        }
      };

      // Create and add heat layer to map
      const heatLayer = L.heatLayer(points, heatMapOptions);
      heatLayer.addTo(map);
      
      // Store reference for cleanup
      heatLayerRef.current = heatLayer;

      console.log("Heat map layer added to map");

      // Cleanup function
      return () => {
        if (heatLayerRef.current) {
          map.removeLayer(heatLayerRef.current);
          heatLayerRef.current = null;
          console.log("Heat map layer removed from map");
        }
      };
    } catch (err) {
      console.error("Error creating heat map:", err);
    }
  }, [map, data]);

  return null;
};

export default HeatMapLayer; 