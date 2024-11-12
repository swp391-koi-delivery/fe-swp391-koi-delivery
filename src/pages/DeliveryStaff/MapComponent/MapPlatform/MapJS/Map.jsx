import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import locationIcon from "./location.png"; // Icon add in map

function Map({ origin, destination, route }) {
  useEffect(() => {
    // Initialize the map, center it to Vietnam's coordinates
    const map = L.map("map").setView([14.0583, 108.2772], 6); // Center at Vietnam
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map,
    );

    // Fix for missing default icons
    delete L.Icon.Default.prototype._getIconUrl;

    // Create custom icons
    const customIcon = new L.Icon({
      iconUrl: locationIcon,
      iconSize: [20, 20], // Kích thước icon
    });

    // Add markers for starting point if within Vietnam's bounds
    if (
      origin &&
      origin.lat >= 8.1 &&
      origin.lat <= 23.4 &&
      origin.lon >= 102.1 &&
      origin.lon <= 109.5
    ) {
      L.marker([origin.lat, origin.lon], { icon: customIcon })
        .addTo(map)
        .bindPopup("Start Location")
        .openPopup();
    }

    // Add markers for the destination if within Vietnam's bounds
    if (
      destination &&
      destination.lat >= 8.1 &&
      destination.lat <= 23.4 &&
      destination.lon >= 102.1 &&
      destination.lon <= 109.5
    ) {
      L.marker([destination.lat, destination.lon], { icon: customIcon })
        .addTo(map)
        .bindPopup("End Location")
        .openPopup();
    }

    // Add route if available and within Vietnam's bounds
    if (route) {
      const validRoute = route.filter(
        ([lon, lat]) =>
          lat >= 8.1 && lat <= 23.4 && lon >= 102.1 && lon <= 109.5,
      );

      if (validRoute.length > 1) {
        L.polyline(
          validRoute.map(([lon, lat]) => [lat, lon]),
          { color: "blue" },
        ).addTo(map);
        map.fitBounds(validRoute.map(([lon, lat]) => [lat, lon]));
      }
    }

    // Cleanup map when unmounting component
    return () => map.remove();
  }, [origin, destination, route]);

  return <div id="map" style={{ height: "600px", width: "100%" }}></div>;
}

export default Map;
