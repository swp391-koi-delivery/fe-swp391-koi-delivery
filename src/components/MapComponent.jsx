import React, { useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Tooltip,
} from "react-leaflet";
import { Modal, Form, Input } from "antd";
import api from "../config/axios"; // Import your configured Axios instance
import { toast } from "react-toastify";
import "leaflet/dist/leaflet.css";

const MapComponent = () => {
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [routeData, setRouteData] = useState(null);
  const mapRef = useRef(); // Reference to the map instance

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmitLocation = async (values) => {
    try {
      setSubmitting(true);
      const { startLocation, endLocation } = values;
      const response = await api.get(
        `route?startLocation=${encodeURIComponent(startLocation)}&endLocation=${encodeURIComponent(endLocation)}`
      );

      // Check if the response contains the expected data
      if (response.data && response.data.coordinates) {
        setRouteData(response.data);
        toast.success("Successfully found location");
      } else {
        toast.error("No route data available.");
        setRouteData(null); // Clear route data if not available
      }

      setOpenModal(false);
      form.resetFields();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderMap = () => {
    const center = [10.762622, 106.660172]; // Default center (Ho Chi Minh City)
    const zoom = 6;

    return (
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "600px", width: "100%" }}
        whenCreated={(map) => {
          mapRef.current = map; // Store the map instance
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {routeData && renderRoute()}
      </MapContainer>
    );
  };

  const renderRoute = () => {
    if (!routeData || !routeData.coordinates || routeData.coordinates.length === 0) {
      return <div>No route data available.</div>; // Handle case where route data is not available
    }

    const { coordinates, totalDistance, totalTime, instructions } = routeData;

    // Ensure coordinates are in the correct format for Polyline
    const formattedCoordinates = coordinates.map(coord => [coord.lat, coord.lng]);

    return (
      <>
        {/* Start Marker */}
        <Marker position={formattedCoordinates[0]}>
          <Popup>Start: {instructions[0]?.location || "Unknown"}</Popup>
        </Marker>
        {/* End Marker */}
        <Marker position={formattedCoordinates[formattedCoordinates.length - 1]}>
          <Popup>End: {instructions[instructions.length - 1]?.location || "Unknown"}</Popup>
        </Marker>
        {/* Polyline for the route */}
        <Polyline positions={formattedCoordinates} color="blue" weight={3}>
          <Tooltip sticky>
            Distance: {totalDistance.toFixed(2)} km
            <br />
            Estimated time: {totalTime}
          </Tooltip>
        </Polyline>
        {/* Markers for each waypoint */}
        {formattedCoordinates.map((position, index) => (
          <Marker key={index} position={position}>
            <Popup>
              {instructions[index]?.instruction || `Waypoint ${index}`}
            </Popup>
          </Marker>
        ))}
      </>
    );
  };

  return (
    <>
      {renderMap()}
      {/* Button to open the modal */}
      <button className="find-location-btn" onClick={handleOpenModal}>
        Find Location
      </button>
      <Modal
        title="Find Location"
        confirmLoading={submitting}
        onOk={() => form.submit()} // Submit form on OK
        open={openModal}
        onCancel={handleCloseModal}
      >
        <Form onFinish={handleSubmitLocation} form={form}>
          <Form.Item
            name="startLocation"
            label="Start Location"
            rules={[{ required: true, message: "Please enter start location" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="endLocation"
            label="End Location"
            rules={[{ required: true, message: "Please enter end location" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MapComponent;
