import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { FaMapMarkerAlt } from "react-icons/fa";

const AddressAutocomplete = ({
  value,
  onChange,
  placeholder,
  onFocus,
  onSelect,
  showSuggestions,
  label,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [localShowSuggestions, setLocalShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

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
    if (value.length > 2 && showSuggestions) {
      const delayDebounceFn = setTimeout(() => {
        axios
          .get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              value,
            )}&limit=5`,
          )
          .then((response) => {
            const uniqueSuggestions = response.data.filter(
              (item, index, self) =>
                index ===
                self.findIndex((t) => t.display_name === item.display_name),
            );
            setSuggestions(uniqueSuggestions);
            setLocalShowSuggestions(true);
          })
          .catch((error) =>
            console.error("Error fetching suggestions:", error),
          );
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSuggestions([]);
      setLocalShowSuggestions(false);
    }
  }, [value, showSuggestions]);

  // Handle selecting a suggestion
  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.display_name);
    onSelect();
    setLocalShowSuggestions(false);
  };

  // Format the suggestion for display
  const formatSuggestion = (suggestion) => {
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
        {/* Icon bên trong input, căn phải */}
        <FaMapMarkerAlt className="absolute right-4 top-1/2 -translate-y-1/2 transform text-gray-400" />
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
};

AddressAutocomplete.defaultProps = {
  placeholder: "Enter address...",
  onFocus: () => {},
  onSelect: () => {},
  showSuggestions: true,
  label: "",
};

export default AddressAutocomplete;
