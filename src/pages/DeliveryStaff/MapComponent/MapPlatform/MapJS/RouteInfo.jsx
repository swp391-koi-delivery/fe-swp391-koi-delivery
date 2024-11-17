import React from 'react';

function RouteInfo({ route }) {
  // If there is no route data or route has less than 2 points, don't render the component
  if (!route || route.length < 2) return null;

  const distance = calculateDistance(route);
  const duration = estimateDuration(distance);

  console.log("Calculated Distance:", distance); // Debug: print distance
  console.log("Estimated Duration (in minutes):", duration); // Debug: print duration

  return (
    <div className="route-info bg-gradient-to-br from-blue-100 to-green-50 p-6 rounded-xl shadow-lg transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-2xl">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Route Information:</h3>
      <p className="text-lg font-medium text-gray-700">
        <span className="text-blue-600">📏 Distance:</span> {distance.toFixed(2)} km
      </p>
      <p className="text-lg font-medium text-gray-700">
        <span className="text-red-600">⏱️ Estimated time:</span> {formatDuration(duration)}
      </p>
    </div>
  );
}

// Function to calculate the total distance of the route
function calculateDistance(route) {
  let distance = 0;
  for (let i = 1; i < route.length; i++) {
    const [lon1, lat1] = route[i - 1];
    const [lon2, lat2] = route[i];
    distance += getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
  }
  return distance;
}

// Haversine formula to calculate the distance between two coordinates (in km)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1); // Difference in latitude
  const dLon = deg2rad(lon2 - lon1); // Difference in longitude
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Returns the distance in km
}

// Function to convert degrees to radians
function deg2rad(deg) {
  return (deg * Math.PI) / 180;
}

// Function to estimate the travel time based on the distance
function estimateDuration(distance) {
  const averageSpeed = 60; // Increase average speed to 60 km/h for realistic estimates
  return (distance / averageSpeed) * 60; // Duration in minutes
}

// Function to format the estimated duration as "hours" and "minutes"
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : ''} ${mins} minute${mins > 1 ? 's' : ''}`;
}

export default RouteInfo;
