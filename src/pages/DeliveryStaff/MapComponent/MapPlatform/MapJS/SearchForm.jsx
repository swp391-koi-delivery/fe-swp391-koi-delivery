import axios from "axios";
import React, { useState } from "react";
import AddressAutocomplete from "./AddressAutocomplete";
import { MdDirections } from "react-icons/md";

function SearchForm({ setOrigin, setDestination, setRoute }) {
  const [originQuery, setOriginQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [activeInput, setActiveInput] = useState(null);
  const [originSelected, setOriginSelected] = useState(false);
  const [destinationSelected, setDestinationSelected] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!originQuery || !destinationQuery) {
      setError(" Please enter your origin and destination.");
      setIsLoading(false);
      return;
    }

    try {
      const origin = await getCoordinates(originQuery);
      const destination = await getCoordinates(destinationQuery);

      if (!origin || !destination) {
        setError("Location not found. Please try again.");
        setIsLoading(false);
        return;
      }

      setOrigin(origin);
      setDestination(destination);

      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=full&geometries=geojson`,
      );
      const routeCoordinates = response.data.routes[0].geometry.coordinates;

      setRoute([...routeCoordinates]);
    } catch (error) {
      setError("An error occurred while searching. Please try again later.");
      console.error("Error searching for locations:", error);
    } finally {
      setIsLoading(false); // Tắt Loading spinner khi hoàn thành hoặc gặp lỗi
    }
  };

  const getCoordinates = async (query) => {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
    );
    if (response.data && response.data.length > 0) {
      return {
        lat: response.data[0].lat,
        lon: response.data[0].lon,
        display_name: response.data[0].display_name,
      };
    }
    return null;
  };

  const handleInputFocus = (inputName) => {
    setActiveInput(inputName);
    if (inputName === "origin") {
      setOriginSelected(false);
    } else {
      setDestinationSelected(false);
    }
  };

  const handleOriginSelect = () => {
    setOriginSelected(true);
    setActiveInput(null);
  };

  const handleDestinationSelect = () => {
    setDestinationSelected(true);
    setActiveInput(null);
  };

  const isButtonDisabled = !originQuery || !destinationQuery;

  return (
    <form
      onSubmit={handleSearch}
      className="mx-auto mt-8 flex max-w-xl transform flex-col gap-6 rounded-xl bg-gradient-to-br from-blue-100 to-green-50 p-8 shadow-lg transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl"
    >
      {/* Origin input */}
      <AddressAutocomplete
        value={originQuery}
        onChange={setOriginQuery}
        placeholder="Origin"
        label="Origin Location (Address):"
        onFocus={() => handleInputFocus("origin")}
        onSelect={handleOriginSelect}
        showSuggestions={activeInput === "origin" && !originSelected}
        className="transform rounded-lg border-2 border-gray-300 p-4 shadow-sm transition-all duration-300 hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Destination input */}
      <AddressAutocomplete
        value={destinationQuery}
        onChange={setDestinationQuery}
        placeholder="Destination"
        label="Destination Location (Address):"
        onFocus={() => handleInputFocus("destination")}
        onSelect={handleDestinationSelect}
        showSuggestions={activeInput === "destination" && !destinationSelected}
        className="transform rounded-lg border-2 border-gray-300 p-4 shadow-sm transition-all duration-300 hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        className="btn-submit_2 mt-4 w-full rounded-md bg-indigo-600 px-8 py-4 text-xl font-semibold text-white transition-all duration-200 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="-ml-1 mr-3 h-6 w-6 animate-spin text-white"
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

      {/* Error message */}
      {error && (
        <div className="mt-4 text-center font-semibold text-red-500">
          {error}
        </div>
      )}
    </form>
  );
}

export default SearchForm;
