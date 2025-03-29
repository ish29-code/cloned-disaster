import { useState, useEffect, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";

// Custom Icons for different severity levels
const createCustomIcon = (color, size = 30) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [size * 0.8, size],
  iconAnchor: [size/2, size],
  popupAnchor: [0, -size],
  shadowSize: [size, size]
});

const severityIcons = {
  high: createCustomIcon('red'),
  moderate: createCustomIcon('orange'),
  low: createCustomIcon('green')
};

const Map = () => {
  const [location, setLocation] = useState("");
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default: India
  const [disasters, setDisasters] = useState([]);
  const [predictionOverlay, setPredictionOverlay] = useState(null);
  const mapRef = useRef(null);

  // Fetch disaster data
  const fetchDisasterData = async (location) => {
    try {
      const response = await axios.get(
        `https://api.reliefweb.int/v1/reports?appname=disasterwatch&preset=latest&limit=10`
      );
      
      if (response.data && response.data.data) {
        const newDisasters = response.data.data.map(report => ({
          position: [
            parseFloat(getRandomOffset(location.lat, 0.1)),
            parseFloat(getRandomOffset(location.lon, 0.1))
          ],
          severity: Math.random() > 0.5 ? 'high' : 'moderate',
          intensity: Math.random() * 100,
          title: report.fields.title,
          description: report.fields.body
        }));
        
        setDisasters(newDisasters);
      }
    } catch (error) {
      console.error("Error fetching disaster data:", error);
    }
  };

  // Search & Fetch Location
  const handleSearch = async () => {
    if (!location.trim()) return;

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
      );

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
        await fetchDisasterData({ lat, lon });
        
        // Generate prediction overlay
        setPredictionOverlay({
          center: [parseFloat(lat), parseFloat(lon)],
          radius: 5000,
          color: 'purple',
          fillColor: 'purple',
          fillOpacity: 0.2
        });
      } else {
        alert("Location not found. Try another search.");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      alert("An error occurred while fetching location.");
    }
  };

  // Helper function for random offsets
  const getRandomOffset = (base, range) => {
    return (parseFloat(base) + (Math.random() * range * 2 - range)).toFixed(6);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="h-20"></div>
      <div className="p-6 sm:p-8 flex flex-col items-center">
        <div className="w-full max-w-7xl">
          <h2 className="text-3xl font-bold mb-6 text-blue-700">Disaster Monitoring Map</h2>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[300px]">
              <input
                type="text"
                placeholder="Enter location to search"
                className="p-3 border border-blue-400 rounded-l w-full text-gray-900 focus:outline-none"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition duration-300"
            >
              Search
            </button>
          </div>

          {/* Map */}
          <div className="w-full h-[70vh] rounded-lg overflow-hidden shadow-lg border border-gray-300">
            <MapContainer
              center={mapCenter}
              zoom={10}
              className="w-full h-full"
              ref={mapRef}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* Prediction Overlay */}
              {predictionOverlay && (
                <Circle
                  center={predictionOverlay.center}
                  radius={predictionOverlay.radius}
                  pathOptions={{
                    color: predictionOverlay.color,
                    fillColor: predictionOverlay.fillColor,
                    fillOpacity: predictionOverlay.fillOpacity,
                    className: 'prediction-overlay'
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <h3 className="font-bold mb-1">Predicted Impact Zone</h3>
                      <p className="text-gray-600">Based on historical data and current conditions</p>
                    </div>
                  </Popup>
                </Circle>
              )}
            </MapContainer>
          </div>

          {/* Legend */}
          <div className="mt-4 p-4 bg-white rounded-lg shadow border border-gray-200">
            <h3 className="font-semibold mb-2">Map Legend</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span>High Severity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span>Moderate Severity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>Low Severity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-500 opacity-50"></div>
                <span>Prediction Zone</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;






