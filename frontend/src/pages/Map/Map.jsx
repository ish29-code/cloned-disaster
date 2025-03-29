import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom Icons
const dangerIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [30, 30],
});

const safeIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [30, 30],
});

const moderateIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
  iconSize: [30, 30],
});

// Component to Handle Map Zoom
const MapZoom = ({ center }) => {
  const map = useMap();
  map.setView(center, 13); // Zoom to new location
  return null;
};

// Function to generate random offset
const getRandomOffset = (range) => (Math.random() * range * 2 - range).toFixed(4);

const Map = () => {
  const [location, setLocation] = useState("");
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default: India
  const [dangerZones, setDangerZones] = useState([]);
  const [safeZones, setSafeZones] = useState([]);
  const [moderateZones, setModerateZones] = useState([]);

  // Search & Fetch Location
  const handleSearch = async () => {
    if (!location.trim()) return;

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
      );

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        const baseLat = parseFloat(lat);
        const baseLon = parseFloat(lon);

        setMapCenter([baseLat, baseLon]);

        // Generate random danger zones
        setDangerZones(Array.from({ length: 3 }, () => ({
          lat: baseLat + parseFloat(getRandomOffset(0.08)),
          lon: baseLon + parseFloat(getRandomOffset(0.08)),
        })));

        // Generate random safe zones
        setSafeZones(Array.from({ length: 3 }, () => ({
          lat: baseLat + parseFloat(getRandomOffset(0.12)),
          lon: baseLon + parseFloat(getRandomOffset(0.12)),
        })));

        // Generate random moderate zones
        setModerateZones(Array.from({ length: 3 }, () => ({
          lat: baseLat + parseFloat(getRandomOffset(0.1)),
          lon: baseLon + parseFloat(getRandomOffset(0.1)),
        })));
      } else {
        alert("Location not found. Try another search.");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      alert("An error occurred while fetching location.");
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen text-gray-900 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">Search a Location</h2>

      {/* Search Input */}
      <div className="flex w-full max-w-lg mb-6">
        <input
          type="text"
          placeholder="Enter city or state"
          className="p-3 border border-yellow-400 rounded-l w-full text-gray-900 focus:outline-none"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="p-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-r transition duration-300"
        >
          Search
        </button>
      </div>

      {/* Map */}
      <div className="w-full max-w-5xl h-[70vh] rounded-lg overflow-hidden shadow-lg border border-gray-300">
        <MapContainer center={mapCenter} zoom={10} className="w-full h-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapZoom center={mapCenter} />

          {/* Danger Zones - Red */}
          {dangerZones.map((zone, index) => (
            <Marker key={index} position={[zone.lat, zone.lon]} icon={dangerIcon}>
              <Popup className="text-red-600 font-semibold">⚠️ Danger Zone</Popup>
            </Marker>
          ))}

          {/* Moderate Zones - Yellow */}
          {moderateZones.map((zone, index) => (
            <Marker key={index} position={[zone.lat, zone.lon]} icon={moderateIcon}>
              <Popup className="text-yellow-500 font-semibold">⚠️ Moderate Zone</Popup>
            </Marker>
          ))}

          {/* Safe Zones - Green */}
          {safeZones.map((zone, index) => (
            <Marker key={index} position={[zone.lat, zone.lon]} icon={safeIcon}>
              <Popup className="text-green-600 font-semibold">✅ Safe Zone</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;






