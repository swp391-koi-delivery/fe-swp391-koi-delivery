import React, { useState } from "react";
import SearchForm from "./MapJS/SearchForm";
import RouteInfo from "./MapJS/RouteInfo";
import Map from "./MapJS/Map";

function MapPlatform() {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState(null);

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-blue-200 to-green-100 p-6">
      <main className="flex w-full max-w-7xl overflow-hidden rounded-lg bg-white shadow-lg">
        {/* Left Side: Search Form and Route Info */}
        <div className="-mt-4 w-1/3 space-y-6 border-r border-gray-200 bg-gray-50 p-6">
          <SearchForm
            setOrigin={setOrigin}
            setDestination={setDestination}
            setRoute={setRoute}
          />
          <RouteInfo route={route} />
        </div>

        {/* Right Side: Map */}
        <div className="w-2/3 p-4">
          <Map origin={origin} destination={destination} route={route} />
        </div>
      </main>
    </div>
  );
}

export default MapPlatform;
