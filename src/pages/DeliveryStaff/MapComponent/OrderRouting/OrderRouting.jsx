import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdDirections } from "react-icons/md";
import api from "../../../../config/axios";
import "./OrderRouting.css";

const RouteStep = ({ step }) => {
  return (
    <li className="transition-transform duration-500 hover:translate-x-2">
      <div className="flex items-center space-x-4 rounded-lg bg-white p-4 shadow-md hover:bg-blue-50">
        <div className="flex-shrink-0">
          <MdDirections className="h-6 w-6 text-blue-500" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-black">{step.instruction}</p>
          <p className="text-black">{step.distance} km</p>
        </div>
      </div>
    </li>
  );
};

const RoutingComponent = () => {
  const [originLocation, setOriginLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [expandedStages, setExpandedStages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.get(`free-access/route`, {
        params: {
          startLocation: originLocation,
          endLocation: destinationLocation,
        },
      });
      console.log(response.data);
      const parsedData = parseRouteResponse(response.data);
      setRouteInfo(parsedData);
    } catch (error) {
      console.error("Error fetching route:", error);
      alert(`Error fetching route: ${error.message}`);
      setRouteInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const parseRouteResponse = (data) => {
    const lines = data.split("\n").filter((line) => line.trim() !== "");
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
      return { instruction: match[1], distance: parseFloat(match[2]) };
    }).filter((step) => step !== null);

    // Group steps into stages of 10 steps each
    const stages = [];
    for (let i = 0; i < steps.length; i += 10) {
      stages.push(steps.slice(i, i + 10));
    }

    return { totalDistance, totalTime, stages };
  };

  const toggleStage = (index) => {
    setExpandedStages((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  return (
    <div className="mx-auto max-w-4xl rounded-xl bg-gradient-to-br from-blue-50 to-green-50 p-6 shadow-lg">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row">
          {/* Origin input */}
          <div className="flex-1">
            <label htmlFor="origin" className="mb-1 block text-sm font-bold text-gray-700">
              Origin Location (Address):
            </label>
            <div className="relative">
              <input
                type="text"
                id="originLocation"
                value={originLocation}
                onChange={(e) => setOriginLocation(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-black transition-all duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter origin location"
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
            <label htmlFor="destination" className="mb-1 block text-sm font-bold text-gray-700">
              Destination Location (Address):
            </label>
            <div className="relative">
              <input
                type="text"
                id="destinationLocation"
                value={destinationLocation}
                onChange={(e) => setDestinationLocation(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-black transition-all duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter destination location"
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
          className="btn-submit_2 mt-4 w-full rounded-md bg-indigo-600 px-4 py-2 text-white transition-all duration-200 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 004 12H0c0 4.418 3.582 8 8 8v-4.709z"
                  ></path>
                </svg>
                Loading...
              </span>
            ) : (
              <span className="flex items-center justify-center">
              <MdDirections className="mr-2" /> Get Route
            </span>
            )} 
        </button>
      </form>

      {/* Route Information Display */}
      {routeInfo ? (
        <div className="mt-8 rounded-md bg-white p-4 shadow-md">
          <h2 className="text-lg font-bold text-blue-500">Route Information</h2>
          <p className="text-red-500">
            <strong>Total Distance:</strong> {routeInfo.totalDistance} km
          </p>
          <p className="text-red-500">
            <strong>Estimated Time:</strong> {routeInfo.totalTime}
          </p>
          <h3 className="text-md mt-4 font-semibold text-black">Stages:</h3>
          {routeInfo.stages && routeInfo.stages.length > 0 ? (
            <div>
              {routeInfo.stages.map((stage, index) => (
                <div key={index}>
                  <div
                    onClick={() => toggleStage(index)}
                    className="mb-2 cursor-pointer rounded-lg bg-gray-200 p-2 transition duration-300 hover:bg-gray-300"
                  >
                    <h4 className="font-semibold text-black">
                      Stage {index + 1} ({stage.length} steps)
                    </h4>
                  </div>
                  {expandedStages.includes(index) && (
                    <ul className="pl-5">
                      {stage.map((step, stepIndex) => (
                        <RouteStep key={stepIndex} step={step} />
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No stages available.</p>
          )}
        </div>
      ) : (
        <p className="mt-8 text-gray-500 text-center">You need enter data to display route information</p>
      )}
    </div>
  );
};

export default RoutingComponent;
