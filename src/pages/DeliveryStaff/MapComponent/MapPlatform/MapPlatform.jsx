import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import api from "../../../../config/axios";
import "./MapPlatform.css";
import { MdDirections } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import locationIcon from './location.png';

// Geocode function to get coordinates from address using Nominatim API
const geocode = async (address) => {
  try {
    const response = await api.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          format: "json",
          q: address,
          addressdetails: 1,
          limit: 1,
          countrycodes: "VN",
          extratags: 1,
        },
      },
    );

    if (response.data.length > 0) {
      const result = response.data[0];
      console.log("Full Address Data:", result.address);

      return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        display_name: result.display_name,
        details: result.address,
      };
    }

    return null;
  } catch (error) {
    return null;
  }
};

// Component to control routing
const RoutingControl = ({ originLocation, destinationLocation }) => {
  const map = useMap();
  useEffect(() => {
    if (originLocation && destinationLocation) {
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(originLocation[0], originLocation[1]),
          L.latLng(destinationLocation[0], destinationLocation[1]),
        ],
        routeWhileDragging: true,
        createMarker: () => null,
        lineOptions: {
          styles: [
            {
              color: "blue",
              opacity: 0.6,
              weight: 5,
            },
          ],
        },
        show: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
      }).addTo(map);

      return () => {
        map.removeControl(routingControl);
      };
    }
  }, [originLocation, destinationLocation, map]);

  return null;
};

// Main component to display map and form
const MapWithRouting = () => {
  const [originAddress, setOriginAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [originLocation, setOriginLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null); // User's current coordinates

  useEffect(() => {
// Get the user's current coordinates
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const originQuery = `${originAddress} Vietnam`;
    const destinationQuery = `${destinationAddress} Vietnam`;

    console.log("Geocoding for:", originQuery, destinationQuery);

    const originData = await geocode(originQuery);
    const destinationData = await geocode(destinationQuery);

    console.log("Origin Location:", originData);
    console.log("Destination Location:", destinationData);

    if (originData && destinationData) {
      setOriginLocation([originData.lat, originData.lon]);
      setDestinationLocation([destinationData.lat, destinationData.lon]);

      try {
        const response = await api.get("free-access/route", {
          params: {
            startLocation: `${originData.lat},${originData.lon}`,
            endLocation: `${destinationData.lat},${destinationData.lon}`,
          },
        });
        console.log("Route data:", response.data);
      } catch (error) {
        console.error("Error fetching route:", error);
        console.error("Error response:", error.response);
        alert(`Error fetching route: ${error.message}`);
      }
    } else {
      alert("Could not retrieve coordinates for the given addresses.");
    }

    setIsLoading(false); 
  };

  return (
    <div className="mx-auto min-h-screen max-w-4xl rounded-xl bg-gradient-to-br from-blue-50 to-green-100 p-6 shadow-lg">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row">
          {/* Origin input */}
          <div className="flex-1">
            <label className="mb-1 block text-sm font-bold text-gray-700">
              Origin Location (Address):
            </label>
            <div className="relative">
              <input
                type="text"
                value={originAddress}
                onChange={(e) => setOriginAddress(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-black transition-all duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter origin location"
                required
              />
              <FaMapMarkerAlt className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
            </div>
          </div>

          {/* Destination input */}
          <div className="flex-1">
            <label className="mb-1 block text-sm font-bold text-gray-700">
              Destination Location (Address):
            </label>
            <div className="relative">
              <input
                type="text"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-black transition-all duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter destination location"
                required
              />
              <FaMapMarkerAlt className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
            </div>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`btn-submit_1 mt-4 w-full rounded-md bg-indigo-600 px-4 py-2 text-white transition-all duration-200 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 004 12H0c0 4.418 3.582 8 8 8v-4.709z"
                ></path>
              </svg>
              Loading...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <MdDirections className="mr-2" /> Get Directions
            </span>
          )}
        </button>
      </form>

      {/* Map */}
      <MapContainer
        center={[10.8231, 106.6297]} 
        zoom={12}
        style={{ height: "600px", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <RoutingControl
          originLocation={originLocation}
          destinationLocation={destinationLocation}
        />
        {currentLocation && (
          <>
            <Marker position={currentLocation}>
              <Popup>You are here!</Popup>
            </Marker>     
            <Circle
              center={currentLocation}
              radius={500} // Radius of the circle
              pathOptions={{
                color: "transparent",
                fillColor: "blue",
                fillOpacity: 0.1,
              }}
            />
          </>
        )}
        {originLocation && (
          <Marker
            position={originLocation}
            icon={L.icon({
              iconUrl: locationIcon,
              iconSize: [20, 20],
            })}
          >
            <Popup>Origin: {originAddress}</Popup>
          </Marker>
        )}
        {destinationLocation && (
          <Marker
            position={destinationLocation}
            icon={L.icon({
              iconUrl: locationIcon,
              iconSize: [20, 20],
            })}
          >
            <Popup>Destination: {destinationAddress}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapWithRouting;
