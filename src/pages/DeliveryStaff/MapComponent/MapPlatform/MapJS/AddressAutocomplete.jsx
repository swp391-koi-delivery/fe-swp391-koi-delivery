import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import yourLocation from "./icons8-my-location-30.png"; // Import the image

const AddressAutocomplete = ({
  value,
  onChange,
  placeholder,
  onFocus,
  onSelect,
  showSuggestions,
  label,
  useCurrentLocation, // New prop to enable "Your Location" suggestion
}) => {
  const [suggestions, setSuggestions] = useState([]); // Initialize as empty array
  const [localShowSuggestions, setLocalShowSuggestions] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null); // Store user's current location
  const wrapperRef = useRef(null);

  // Fetch user's current location
  useEffect(() => {
    if (useCurrentLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Convert lat, lon to a readable address using Nominatim API
          axios
            .get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            )
            .then((response) => {
              if (response && response.data && response.data.display_name) {
                setCurrentLocation({
                  display_name: "Your Location", // Initially display as "Your Location"
                  address: response.data.display_name,
                  lat: latitude,
                  lon: longitude,
                });
              }
            })
            .catch((error) => {
              console.error("Error fetching current location address:", error);
            });
        },
        (error) => console.error("Error fetching current location:", error),
      );
    }
  }, [useCurrentLocation]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setLocalShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions from Nominatim API
  useEffect(() => {
    if (value && value.length > 2 && showSuggestions) {
      const delayDebounceFn = setTimeout(() => {
        axios
          .get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              value,
            )}&limit=5`,
          )
          .then((response) => {
            if (response && response.data) {
              const uniqueSuggestions = response.data.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex((t) => t.display_name === item.display_name),
              );

              if (currentLocation) {
                setSuggestions([currentLocation, ...uniqueSuggestions]); // Add "Your Location" to suggestions
              } else {
                setSuggestions(uniqueSuggestions);
              }
              setLocalShowSuggestions(true);
            } else {
              console.error("Error: Invalid API response", response);
            }
          })
          .catch((error) =>
            console.error("Error fetching suggestions:", error),
          );
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSuggestions([]); // Reset suggestions if value is too short or showSuggestions is false
      setLocalShowSuggestions(false);
    }
  }, [value, showSuggestions, currentLocation]);

  // Handle selecting a suggestion
  const handleSuggestionClick = (suggestion) => {
    if (suggestion.display_name === "Your Location" && currentLocation) {
      // Update address to "My Location" when selecting "Your Location"
      onChange(currentLocation.address); // Use currentLocation's address here
    } else {
      onChange(suggestion.display_name);
    }
    onSelect(suggestion);
    setLocalShowSuggestions(false);
  };

  // Format the suggestion for display
  const formatSuggestion = (suggestion) => {
    if (suggestion.display_name === "Your Location") {
      return (
        <div className="flex items-center">
          <img
            src={yourLocation} // Use the yourLocation image
            alt="Your Location"
            className="mr-2 h-6 w-6" // Adjust the size if needed
          />
          <strong>{suggestion.display_name}</strong>
        </div>
      );
    }
    const parts = suggestion.display_name.split(", ");
    return (
      <>
        <strong>{parts[0]}</strong>
        <br />
        <small>{parts.slice(1).join(", ")}</small>
      </>
    );
  };

  return (
    <div className="relative" ref={wrapperRef}>
      {label && (
        <label className="mb-1 block font-semibold text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => {
            onFocus();
            setLocalShowSuggestions(true);
          }}
          className="w-full rounded-lg border-2 p-4 pr-12 text-lg text-gray-700 shadow-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {localShowSuggestions && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 z-10 mt-2 max-h-60 overflow-y-auto rounded-lg border-2 border-gray-300 bg-white shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="cursor-pointer px-4 py-2 text-black transition duration-300 hover:bg-blue-100"
            >
              {formatSuggestion(suggestion)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

AddressAutocomplete.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  onFocus: PropTypes.func,
  onSelect: PropTypes.func,
  showSuggestions: PropTypes.bool,
  label: PropTypes.string,
  useCurrentLocation: PropTypes.bool, // New prop
};

AddressAutocomplete.defaultProps = {
  placeholder: "Enter address...",
  onFocus: () => {},
  onSelect: () => {},
  showSuggestions: true,
  label: "",
  useCurrentLocation: true, // Enable by default
};

export default AddressAutocomplete;
