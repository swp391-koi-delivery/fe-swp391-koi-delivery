import React from 'react';

function RouteInfo({ route }) {
  // If there is no route data, don't render the component
  if (!route || route.length < 2) return null;

  const distance = calculateDistance(route);
  const duration = estimateDuration(distance);

  return (
    <div className="route-info bg-gradient-to-br from-blue-100 to-green-50 p-6 rounded-xl shadow-lg transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-2x">
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

// Function to calculate the distance between points in the route
function calculateDistance(route) {
  let distance = 0;
  for (let i = 1; i < route.length; i++) {
    const [lon1, lat1] = route[i - 1];
    const [lon2, lat2] = route[i];
    distance += getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
  }
  return distance;
}

// Function (Harversine) to calculate the distance between two coordinates (in km)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth (km)
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Function to convert degrees to radians
function deg2rad(deg) {
  return (deg * Math.PI) / 180;
}

// Function to estimate the time based on the distance
function estimateDuration(distance) {
  const averageSpeed = 30; // Average speed (km/h)
  return (distance / averageSpeed) * 60; // Returns time in minutes
}

// Function to format the duration as "hours" and "minutes"
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours > 0 ? `${hours} hour` : ''} ${mins} minutes`;
}

export default RouteInfo;
