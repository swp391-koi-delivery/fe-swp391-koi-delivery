import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaTruck, FaRoute } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";
import api from "../../../config/axios";

const OrderDetails = () => {
  const {orderId } = useParams(); // Nhận orderId từ URL
  const [order, setOrder] = useState(null);
  const [distance, setDistance] = useState("Calculating...");

  const fetchOrder = async () => {
    try {
      const response = await api.get("orders");
      setOrder(response.data);
      
      // Giả lập việc tính toán khoảng cách
      setTimeout(() => {
        setDistance("5.0 km");
      }, 2000);
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const calculateExpectedDeliveryDate = () => {
    if (!order || !order.orderDate) return ""; // Kiểm tra sự tồn tại của orderDate

    const timestamp = order.orderDate * 1000; // Chuyển timestamp sang mili giây
    const orderDate = new Date(timestamp);

    // Kiểm tra nếu orderDate không hợp lệ
    if (isNaN(orderDate.getTime())) {
      console.error("Invalid orderDate:", order.orderDate);
      return "Invalid date";
    }

    const daysToAdd = 2; // Giả sử thời gian giao hàng cố định là 2 ngày
    const expectedDate = new Date(orderDate.setDate(orderDate.getDate() + daysToAdd));
    return expectedDate.toISOString().split("T")[0];
  };

  if (!order) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container_3 my-5">
      <div className="bg-dark text-light rounded shadow-lg p-4">
        <h2 className="text-center mb-4">Order Details</h2>
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="mb-3">
              <h5 className="text-primary">
                <FaTruck /> Order ID: {order.orderId}
              </h5>
              <p>
                <FaCalendarAlt /> Order Date: {order.orderDate}
                </p>
            </div>
            <div className="mb-3">
              <p>
                <FaMapMarkerAlt className="text-danger" /> Origin: {order.originLocation}
              </p>
              <p>
                <FaMapMarkerAlt className="text-success" /> Destination: {order.destinationLocation}
              </p>
              <p>
                <FaRoute className="text-info" /> Distance: {distance}
              </p>
              <p>
                <FaCalendarAlt /> Expected Delivery: {calculateExpectedDeliveryDate()}
              </p>
            </div>
          </div>
        </div>
        <div className="text-center">
          <button className="btn btn-outline-light" onClick={() => window.open("https://www.google.com/maps", "_blank")}>
            Open in Google Maps
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
