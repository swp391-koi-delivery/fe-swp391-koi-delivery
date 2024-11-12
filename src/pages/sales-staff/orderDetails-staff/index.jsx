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
      const data = response.data.content;
      const foundOrder = data.find(
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

  const formatPriceDollar = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };
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
    <div className="mx-auto max-w-7xl bg-gradient-to-br from-blue-100 to-purple-100 p-6">
      <div className="mx-auto max-w-2xl space-y-5 rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-3xl font-bold text-indigo-800">
          Order: {order.id}
        </h2>
        {order.orderDetails.length > 0 ? (
          order.orderDetails.map((detail, index) => (
            <div
              key={index}
              className="mb-6 transform rounded-lg bg-gray-100 p-3 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FaInfoCircle className="text-black" />
                  <span className="font-bold text-gray-700">
                    ID: {detail.id}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.orderStatus)}
                  <span className="text-sm font-bold text-black">
                    {order.orderStatus}
                  </span>
                </div>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <FaFish className="text-orange-400" />
                  <span className="text-gray-700">
                    Type: {detail.fishSpecies}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaBoxOpen className="text-blue-500" />
                  <span className="text-gray-700">
                    Number of fish: {detail.numberOfFish}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaRuler className="text-purple-500" />
                  <span className="text-gray-700">
                    Size of fish: {detail.sizeOfFish} cm
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaDollarSign className="text-green-500" />
                  <span className="text-gray-700">
                    Price of fish: {formatPriceDollar(detail.priceOfFish)}
                  </span>
                </div>
              </div>
              <Link
                to={`/dashboard/orderDetailsInfo/${order.id}`}
                className="flex w-full items-center justify-center space-x-2 rounded-md bg-blue-500 px-4 py-2 text-white transition-colors duration-300 ease-in-out hover:bg-blue-600"
              >
                <FaInfoCircle />
                <span>Information</span>
              </Link>
            </div>
          ))
        ) : (
          <p>No order details available.</p>
        )}
      </div>
    </div>
    
  );
}

export default OrderDetailStaff
