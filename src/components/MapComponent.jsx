import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "polyline-encoded"; 
import polyline from "@mapbox/polyline";
import api from "../config/axios"; 

const MapComponent = () => {
  const [polylineCoordinates, setPolylineCoordinates] = useState([]);

  // Hàm để gọi API từ backend
  const fetchRouteFromBackend = async () => {

    try {
      const response = await fetch(api);
      const data = await response.json();
      // const data = await api.get("route", json());

      if (data.points) {
        const encodedPolyline = data.points;
        // Giải mã chuỗi polyline
        const decodedPolyline = L.PolylineUtil.decode(encodedPolyline);
        setPolylineCoordinates(decodedPolyline);
      }
    } catch (error) {
      console.error("Error fetching route from backend:", error);
    }
  };

  // Gọi API từ backend khi component được mount
  useEffect(() => {
    fetchRouteFromBackend();
  }, []);

  return (
    <MapContainer
      center={[14.0583, 108.2772]}
      zoom={13}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Vẽ polyline nếu đã có dữ liệu */}
      {polylineCoordinates.length > 0 && (
        <Polyline positions={polylineCoordinates} color="blue" />
      )}
    </MapContainer>
  );
};

export default MapComponent;
