import React, { useState, useEffect } from "react";
import { FaInfoCircle, FaFish, FaRuler, FaDollarSign, FaCheckCircle, FaSpinner, FaTruck, FaBoxOpen } from "react-icons/fa";
import { useParams, Link } from "react-router-dom";
import api from "../../../config/axios";


function OrderDetailStaff() {
  const { id } = useParams(); // Get orderId from URL
  const [order, setOrder] = useState(null); // Initialize as null to check for data loading
  const [loading, setLoading] = useState(true); // Loading state to show a loader or fallback

  const fetchOrder = async () => {
    try {
      const response = await api.get(`order/allOrder?page=1&size=1000000000`);
      const foundOrder = response.data.find(
        (order) => order.id === parseInt(id)
      ); // Find order that matches id
      
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setOrder(null);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching order:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // const formatPrice = (price) => {
  //   return new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: "USD",
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2,
  //   }).format(price);
  // };
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "SHIPPING":
        return <FaTruck className="text-yellow-400 animate-spin" />;
      case "DELIVERED":
        return <FaCheckCircle className="text-green-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!order) {
    return <div className="text-center">Order not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-indigo-800 text-center">Order: {order.id}</h2>
      {order.orderDetails.length > 0 ? (
            order.orderDetails.map((detail, index) => (
      <div key={index} className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            {getStatusIcon(order.orderStatus)}
            <span className="text-sm font-bold text-black">{order.orderStatus}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
            <FaFish className="text-orange-400" />
            <span className="text-gray-700">Type: {(detail.fishSpecies)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaBoxOpen className="text-blue-500" />
            <span className="text-gray-700">Number of fish: {detail.numberOfFish}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaRuler className="text-purple-500" />
            <span className="text-gray-700">Size of fish: {detail.sizeOfFish} cm</span>
          </div><div className="flex items-center space-x-2">
            <FaDollarSign className="text-green-500" />
            <span className="text-gray-700">Price of fish: {formatPrice(detail.priceOfFish)}</span>
          </div>        
        </div>
        <Link  to = {`/dashboard/orderDetailsInfo/${order.id}`} className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 ease-in-out flex items-center justify-center space-x-2">
          <FaInfoCircle />  
          <span>Information</span>
        </Link>
      </div>
         ))):(
          <p>No order details available.</p>
        )}
        
    </div>
    
  );
}

export default OrderDetailStaff