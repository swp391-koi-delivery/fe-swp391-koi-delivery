import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdDirections } from "react-icons/md";
import api from "../../../config/axios";
import "./OrderRouting.css";

const RoutingComponent = () => {
  const [orders, setOrders] = useState([]);
  const [originLocation, setOriginLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isRouteInfoVisible, setIsRouteInfoVisible] = useState(false); // State for toggling route info visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.get(`route`, {
        params: {
          startLocation: originLocation,
          endLocation: destinationLocation,
        },
      });
      console.log(response.data);
      const parsedData = parseRouteResponse(response.data);
      setRouteInfo(parsedData);
      setIsRouteInfoVisible(true); // Show route info after fetching
    } catch (error) {
      console.error("Error fetching route:", error);
      alert(`Error fetching route: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const parseRouteResponse = (data) => {
    const lines = data.split("\n").filter(line => line.trim() !== "");
    if (lines.length < 4) {
      throw new Error("Invalid route response data. Expected at least 4 lines.");
    }
  
    const totalDistanceMatch = lines[0].match(/(\d+.\d+)/);
    const totalTimeMatch = lines[1].match(/(\d+ hrs \d+ mins)/);
  
    if (!totalDistanceMatch || !totalTimeMatch) {
      throw new Error("Total distance or time not found in the response.");
    }
  
    const totalDistance = totalDistanceMatch[0];
    const totalTime = totalTimeMatch[0];
    const steps = lines.slice(2).map((line) => {
      const match = line.match(/- (.+?) \((\d+.\d+) km\)/);
      if (!match) {
        console.warn(`Invalid step format for line: ${line}`);
        return null;
      }
      return { instruction: match[1], distance: match[2] };
    }).filter(step => step !== null);
  
    return { totalDistance, totalTime, steps };
  };

  return (
    <div className="mx-auto max-w-4xl rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 p-6 shadow-lg">
      <h1 className="mb-8 text-center text-3xl font-bold text-indigo-800">
        Route Planner
      </h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row">
          {/* Origin input */}
          <div className="flex-1">
            <label
              htmlFor="origin"
              className="mb-1 block text-sm font-bold text-gray-700"
            >
              Origin
            </label>
            <div className="relative">
              <input
                type="text"
                id="originLocation"
                value={originLocation}
                onChange={(e) => setOriginLocation(e.target.value)}
                className="w-full rounded-md border border-gray-300 text-black px-4 py-2 transition-all duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter origin"
                list="originSuggestions"
                required
              />
              <FaMapMarkerAlt className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
              <datalist id="originSuggestions">
                {suggestions.map((suggestion) => (
                  <option key={suggestion} value={suggestion} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Destination input */}
          <div className="flex-1">
            <label
              htmlFor="destination"
              className="mb-1 block text-sm font-bold text-gray-700"
            >
              Destination
            </label>
            <div className="relative">
              <input
                type="text"
                id="destinationLocation"
                value={destinationLocation}
                onChange={(e) => setDestinationLocation(e.target.value)}
                className="w-full rounded-md border border-gray-300 text-black px-4 py-2 transition-all duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter destination"
                list="destinationSuggestions"
                required
              />
              <FaMapMarkerAlt className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
              <datalist id="destinationSuggestions">
                {suggestions.map((suggestion) => (
                  <option key={suggestion} value={suggestion} />
                ))}
              </datalist>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="btn-submit mt-4 w-full rounded-md bg-indigo-600 px-4 py-2 text-white transition-all duration-200 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={isLoading}
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <MdDirections className="mr-2" /> Get Directions
            </span>
          )}
        </button>
      </form>

      {/* Toggle button for route information */}
      {routeInfo && (
        <div className="mb-4 text-center">
          <button
            className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white transition-all duration-200 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => setIsRouteInfoVisible(!isRouteInfoVisible)}
          >
            {isRouteInfoVisible ? "Hide Information" : "Show Information"}
          </button>
        </div>
      )}

      {/* Display route information if visible */}
      {isRouteInfoVisible && routeInfo && (
        <div className="rounded-lg bg-white p-6 shadow-md transition-all duration-300 ease-in-out">
          
          <div className="mb-4">
            <p className="mb-2 text-lg font-medium text-red-600">
              Total Distance: {routeInfo.totalDistance} km
            </p>
            <p className="text-lg font-medium text-red-600">
              Total Time: {routeInfo.totalTime}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-blue-500 text-lg font-semibold">Route Steps:</h3>
              {routeInfo.steps && routeInfo.steps.length > 0 ? (
                <ol className="list-inside list-decimal space-y-2">
                  {routeInfo.steps.map((step, index) => (
                    <li
                      key={index}
                      className="text-gray-700 transition-colors duration-200 hover:text-indigo-600"
                    >
                      {step.instruction} ({step.distance} km)
                    </li>
                  ))}
                </ol>
              ) : (
                <p>No route steps available.</p>
              )}
            </div>
          </div>
        </div>
      )}
      {isRouteInfoVisible && !routeInfo && (
        <p className="text-center text-gray-600">No route information available.</p>
      )}
    </div>
  );
};

export default RoutingComponent;
