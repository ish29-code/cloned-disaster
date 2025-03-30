import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, LayersControl, ZoomControl, useMap, Marker, Popup } from 'react-leaflet';
import HeatMapLayer from '../../components/HeatMapLayer/HeatMapLayer';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaSearch, FaLayerGroup, FaInfoCircle, FaMapMarkerAlt, FaExclamationTriangle } from 'react-icons/fa';

// Default marker icon fix for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom marker icons for different alert levels
const icons = {
  Red: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  Orange: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  Green: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  Blue: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
};

// Component to Handle Map Zoom
const MapZoom = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 5);
  }, [center, map]);
  return null;
};

// Mock disaster data in case API fails
const mockDisasters = [
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

const MapView = () => {
  const [location, setLocation] = useState("");
  const [mapCenter, setMapCenter] = useState([20, 77]); // Default: India
  const [disasters, setDisasters] = useState([]);
  const [showHeatMap, setShowHeatMap] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [usingMockData, setUsingMockData] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [showLegend, setShowLegend] = useState(true);

  // Fetch disaster data
  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch disaster data from the backend
        console.log("Fetching disaster data from API...");
        const response = await axios.get('https://cloned-disaster.onrender.com/api/disasters');
        console.log("API Response:", response.data);
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          // Process and validate the data
          const validData = response.data.filter(item => 
            item.location && 
            item.location.coordinates && 
            item.location.coordinates.length === 2 &&
            !isNaN(item.location.coordinates[0]) && 
            !isNaN(item.location.coordinates[1])
          );
          
          setDisasters(validData);
          setUsingMockData(false);
          console.log("Using real data:", validData.length, "valid disasters");
        } else {
          // If no valid data, use mock data
          console.log("No valid data from API, using mock data");
          setDisasters(mockDisasters);
          setUsingMockData(true);
        }
      } catch (err) {
        console.error('Error fetching disaster data:', err);
        setError('Failed to load disaster data. Using sample data instead.');
        setDisasters(mockDisasters);
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDisasters();
  }, []);

  // Search & Fetch Location
  const handleSearch = async () => {
    if (!location.trim()) {
      setSearchError("Please enter a location");
      return;
    }

    setSearchError("");
    setLoading(true);

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
      );

      if (response.data.length > 0) {
        const { lat, lon, display_name } = response.data[0];
        const newCenter = [parseFloat(lat), parseFloat(lon)];
        setMapCenter(newCenter);
        setSearchResult({
          position: newCenter,
          name: display_name
        });
        console.log("Location found:", display_name, newCenter);
      } else {
        setSearchError("Location not found. Please try another search.");
        setSearchResult(null);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setSearchError("An error occurred while searching. Please try again.");
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="h-screen w-full relative bg-gray-900">
      {/* Search Bar with Enhanced UI */}
      <div className="absolute top-5 left-5 z-[1000] w-96 max-w-[calc(100vw-40px)]">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-4">
            <h2 className="text-gray-800 font-bold mb-2 text-lg flex items-center">
              <FaSearch className="mr-2 text-blue-600" />
              Find Location
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search for a location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-gray-50 transition-all duration-200"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400 shadow-md disabled:cursor-not-allowed font-medium flex items-center"
              >
                {loading ? (
                  <span className="inline-block animate-spin mr-1">⟳</span>
                ) : (
                  <FaSearch className="mr-1" />
                )}
                <span>Search</span>
              </button>
            </div>
            {searchError && (
              <p className="text-red-500 text-sm mt-1 font-medium">{searchError}</p>
            )}
            {searchResult && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                <span className="font-medium">Found:</span> {searchResult.name}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Heat Map Toggle and Legend - Enhanced UI */}
      <div className="absolute top-5 right-5 z-[1000] flex flex-col space-y-4">
        {/* Controls Panel */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-4">
            <h2 className="text-gray-800 font-bold mb-2 text-lg flex items-center">
              <FaLayerGroup className="mr-2 text-blue-600" />
              Map Controls
            </h2>
            <div className="space-y-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showHeatMap}
                  onChange={(e) => setShowHeatMap(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">Show Heat Map</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLegend}
                  onChange={(e) => setShowLegend(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">Show Legend</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Legend Panel */}
        {showLegend && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-4">
              <h2 className="text-gray-800 font-bold mb-2 text-lg flex items-center">
                <FaInfoCircle className="mr-2 text-blue-600" />
                Disaster Map Legend
              </h2>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">Marker Colors</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-red-600 mr-2"></div>
                    <span className="text-sm text-gray-600">Red Alert - Critical</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
                    <span className="text-sm text-gray-600">Orange Alert - Warning</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm text-gray-600">Green Alert - Watch</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm text-gray-600">Search Result</span>
                  </div>
                </div>
                
                {showHeatMap && (
                  <>
                    <h3 className="font-semibold text-gray-700 mt-3">Heat Map Colors</h3>
                    <div className="h-6 w-full rounded-full bg-gradient-to-r from-blue-500 via-yellow-300 to-red-600"></div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Low Intensity</span>
                      <span>High Intensity</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      <p>Intensity based on alert level, disaster type, and recency</p>
                    </div>
                  </>
                )}
                
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-700">Disaster Types</h3>
                  <div className="mt-1 grid grid-cols-2 gap-1 text-xs">
                    <span><b>EQ</b>: Earthquake</span>
                    <span><b>TC</b>: Tropical Cyclone</span>
                    <span><b>FL</b>: Flood</span>
                    <span><b>DR</b>: Drought</span>
                    <span><b>VO</b>: Volcano</span>
                    <span><b>WF</b>: Wildfire</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message - Enhanced UI */}
      {error && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-[1000] bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md flex items-center">
          <FaExclamationTriangle className="mr-2" />
          {error}
        </div>
      )}

      {/* Mock Data Notice - Enhanced UI */}
      {usingMockData && (
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-[1000] bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg shadow-md flex items-center">
          <FaInfoCircle className="mr-2" />
          Using sample disaster data. Connect to a real API for live data.
        </div>
      )}

      {/* Loading Overlay - Enhanced UI */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1001]">
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-3"></div>
            <div className="text-lg font-semibold text-gray-700">Loading...</div>
          </div>
        </div>
      )}

      <MapContainer
        center={mapCenter}
        zoom={5}
        className="h-full w-full"
        zoomControl={false}
        worldCopyJump={true}
      >
        <MapZoom center={mapCenter} />
        <ZoomControl position="bottomright" />
        
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="Dark Mode">
            <TileLayer
              url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* Search Result Marker */}
        {searchResult && (
          <Marker 
            position={searchResult.position} 
            icon={icons.Blue}
          >
            <Popup className="custom-popup">
              <div className="text-sm bg-white p-3 rounded-lg shadow-md">
                <div className="font-bold text-gray-800 mb-1 flex items-center">
                  <FaMapMarkerAlt className="text-blue-600 mr-1" />
                  Location Found
                </div>
                <div className="text-gray-700 break-words">
                  {searchResult.name}
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Disaster Markers */}
        {disasters.map((disaster, index) => {
          try {
            // Safely handle coordinates with fallbacks
            const lat = disaster.location.coordinates[1] || 0;
            const lng = disaster.location.coordinates[0] || 0;
            
            // Skip invalid coordinates
            if (lat === 0 && lng === 0) return null;
            
            // Determine icon by alert level
            let iconKey = "Blue"; // Default to blue
            if (disaster.alertLevel === "Red") {
              iconKey = "Red";
            } else if (disaster.alertLevel === "Orange") {
              iconKey = "Orange";
            } else if (disaster.alertLevel === "Green") {
              iconKey = "Green";
            }
            
            return (
              <Marker
                key={index}
                position={[lat, lng]}
                icon={icons[iconKey]}
              >
                <Popup>
                  <div className="text-sm bg-white p-3 rounded-lg shadow-md">
                    <h3 className="font-bold text-lg text-gray-800 mb-2 border-b pb-1">{disaster.title || "Unknown Disaster"}</h3>
                    <p className="text-gray-600 mb-2">{disaster.description || "No description available"}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        disaster.alertLevel === "Red" ? "bg-red-100 text-red-800" :
                        disaster.alertLevel === "Orange" ? "bg-orange-100 text-orange-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {disaster.alertLevel || "Unknown"} Alert
                      </span>
                      
                      <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                        Type: {disaster.type || "Unknown"}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      Date: {disaster.date ? new Date(disaster.date).toLocaleDateString() : "Unknown"}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          } catch (err) {
            console.error("Error rendering marker:", err, disaster);
            return null;
          }
        })}

        {showHeatMap && disasters.length > 0 && (
          <HeatMapLayer data={disasters} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;






