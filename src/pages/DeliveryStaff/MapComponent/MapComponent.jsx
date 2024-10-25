import React, { useState } from "react";
import { MdMap, MdDirections } from "react-icons/md";
import MapPlatform from "./MapPlatform/MapPlatform";
import OrderRouting from "./OrderRouting/OrderRouting";
const MapRoutingComponent = () => {
  const [view, setView] = useState("map"); // State to manage the current view

  // Function to toggle between views
  const toggleView = () => {
    setView((prevView) => (prevView === "map" ? "routing" : "map"));
  };

  return (
    <div className="mx-auto max-w-5xl p-6 bg-gradient-to-br from-blue-200 to-green-100" >
      <h1 className="text-center text-3xl font-bold text-indigo-800 mb-6">Map & Routing</h1>
      {/* Toggle Button */}
      <div className="mb-4 text-center">
        <button
          onClick={toggleView}
          className="rounded-md bg-blue-600 px-4 py-2 text-white transition-all duration-200 ease-in-out hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {view === "map" ? (
            <>
              <MdDirections className="inline-block mr-2" />
              Switch to Routing View
            </>
          ) : (
            <>
              <MdMap className="inline-block mr-2" />
              Switch to Map View
            </>
          )}
        </button>
      </div>

      {/* View Selection */}
      {view === "map" ? (
        <MapPlatform /> // Render the map view component
      ) : (
        <OrderRouting /> // Render the routing component
      )}
    </div>
  );
};

export default MapRoutingComponent;
