import React, { useState, useEffect } from "react";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaBoxOpen,
  FaTruck,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaFish,
  FaCreditCard,
  FaUser,
  FaBox,
  FaStar,
  FaHashtag,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import api from "../../../config/axios";

const OrderDetailsInfo = () => {
  const { id } = useParams(); // Get orderId from URL
  const [order, setOrder] = useState(null); // Initialize as null to check for data loading
  const [loading, setLoading] = useState(true); // Loading state to show a loader or fallback

  const fetchOrder = async () => {
    try {
      const response = await api.get(`order`);
      const foundOrder = response.data.find(
        (order) => order.id === parseInt(id),
      ); // Find order that matches id
      const data = response.data;
      console.log(data);
      data.find((item) => console.log(item.orderDetails));
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

  // Render a loading state if the data is still being fetched
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  // If no order is found, render an error message
  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Order not found
      </div>
    );
  }

  const inputVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  const updateOrderStatus = () => {
    const statuses = ["Shipping", "Delivered"];
    const currentIndex = statuses.indexOf(order.orderStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    setOrder({ ...order, orderStatus: statuses[nextIndex] });
  };

  const updateHealthFishStatus = () => {
    const statuses = ["Healthy", "Unhealthy"];
    const currentIndex = statuses.indexOf(order.healthFishStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    setOrder({ ...order, healthFishStatus: statuses[nextIndex] });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl rounded-xl bg-white p-8 shadow-2xl"
      >
        <h1 className="mb-6 text-center text-3xl font-bold text-indigo-700">
          Order Details
        </h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <motion.div
            className="flex items-center space-x-4"
            whileHover="hover"
            whileTap="tap"
            variants={inputVariants}
          >
            <label className="w-1/3 text-right font-semibold text-gray-700">
              <FaUser className="text-grey-200 mr-2 inline-block" />
              Order ID:
            </label>
            <input
              type="text"
              value={order.id}
              readOnly
              className="w-2/3 rounded-md bg-gray-100 p-2 text-black transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Order ID"
            />
          </motion.div>
          <motion.div
            className="flex items-center space-x-4"
            whileHover="hover"
            whileTap="tap"
            variants={inputVariants}
          >
            <label className="w-1/3 text-right font-semibold text-gray-700">
              <FaCalendarAlt className="mr-2 inline-block text-indigo-200" />
              Order Date:
            </label>
            <input
              type="date"
              value={order.orderDate}
              readOnly
              className="w-2/3 rounded-md bg-gray-100 p-2 text-black transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Order Date"
            />
          </motion.div>
          <motion.div
            className="flex items-center space-x-4"
            whileHover="hover"
            whileTap="tap"
            variants={inputVariants}
          >
            <label className="w-1/3 text-right font-semibold text-gray-700">
              <FaMapMarkerAlt className="mr-2 inline-block text-blue-500" />
              Origin:
            </label>
            <input
              type="text"
              value={order.originLocation}
              readOnly
              className="w-2/3 rounded-md bg-gray-100 p-2 text-black transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Origin Location"
            />
          </motion.div>
          <motion.div
            className="flex items-center space-x-4"
            whileHover="hover"
            whileTap="tap"
            variants={inputVariants}
          >
            <label className="w-1/3 text-right font-semibold text-gray-700">
              <FaMapMarkerAlt className="mr-2 inline-block text-red-500" />
              Destination:
            </label>
            <input
              type="text"
              value={order.destinationLocation}
              readOnly
              className="w-2/3 rounded-md bg-gray-100 p-2 text-black transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Destination Location"
            />
          </motion.div>
          <motion.div
            className="flex items-center space-x-4"
            whileHover="hover"
            whileTap="tap"
            variants={inputVariants}
          >
            <label className="w-1/3 text-right font-semibold text-gray-700">
              <FaStar className="mr-2 inline-block text-purple-500" />
              Size:
            </label>
            <input
              type="text"
              value={order.size}
              readOnly
              className="w-2/3 rounded-md bg-gray-100 p-2 text-black transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Size"
            />
          </motion.div>
          <motion.div
            className="flex items-center space-x-4"
            whileHover="hover"
            whileTap="tap"
            variants={inputVariants}
          >
            <label className="w-1/3 text-right font-semibold text-gray-700">
              <FaBoxOpen className="mr-2 inline-block text-green-500" />
              Quantity:
            </label>
            <input
              type="number"
              value={order.totalquantity}
              readOnly
              className="w-2/3 rounded-md bg-gray-100 p-2 text-black transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Quantity"
            />
          </motion.div>
          <motion.div
            className="flex items-center space-x-4"
            whileHover="hover"
            whileTap="tap"
            variants={inputVariants}
          >
            <label className="w-1/3 text-right font-semibold text-gray-700">
              <FaMoneyBillWave className="mr-2 inline-block text-yellow-500" />
              Total Price:
            </label>
            <input
              type="text"
              value={`$${order.totalPrice}`}
              readOnly
              className="w-2/3 rounded-md bg-gray-100 p-2 text-black transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Total Price"
            />
          </motion.div>
          <motion.div
            className="flex items-center space-x-4"
            whileHover="hover"
            whileTap="tap"
            variants={inputVariants}
          >
            <label className="w-1/3 text-right font-semibold text-gray-700">
              <FaTruck className="mr-2 inline-block text-blue-500" />
              Order Status:
            </label>
            <div className="flex w-2/3 items-center">
              <input
                type="text"
                value={order.orderStatus}
                readOnly
                className="w-full rounded-l-md bg-gray-100 p-2 text-black transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Order Status"
              />
              <button
                onClick={updateOrderStatus}
                className="rounded-r-md bg-indigo-500 p-2 text-white transition-all duration-300 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Update Order Status"
              >
                <FaArrowRight />
              </button>
            </div>
          </motion.div>
          <motion.div
            className="flex items-center space-x-4"
            whileHover="hover"
            whileTap="tap"
            variants={inputVariants}
          >
            <label className="w-1/3 text-right font-semibold text-gray-700">
              <FaCreditCard className="mr-2 inline-block text-orange-500" />
              Payment Method:
            </label>
            <input
              type="text"
              value={order.paymentMethod}
              readOnly
              className="w-2/3 rounded-md bg-gray-100 p-2 text-black transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Payment Method"
            />
          </motion.div>
          <motion.div
            className="flex items-center space-x-4"
            whileHover="hover"
            whileTap="tap"
            variants={inputVariants}
          >
            <label className="w-1/3 text-right font-semibold text-gray-700">
              <FaBox className="mr-2 inline-block text-amber-700" />
              Volume:
            </label>
            <input
              type="text"
              value={order.totalVolume}
              readOnly
              className="w-2/3 rounded-md bg-gray-100 p-2 text-black transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Payment Status"
            />
          </motion.div>
          <motion.div
            className="flex items-center space-x-4"
            whileHover="hover"
            whileTap="tap"
            variants={inputVariants}
          >
            <label className="w-1/3 text-right font-semibold text-gray-700">
              <FaFish className="mr-2 inline-block text-green-500" />
              Health Fish Status:
            </label>
            <div className="flex w-2/3 items-center">
              <input
                type="text"
                value={order.healthFishStatus}
                readOnly
                className="w-full rounded-l-md bg-gray-100 p-2 text-black transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Health Fish Status"
              />
              <button
                onClick={updateHealthFishStatus}
                className="rounded-r-md bg-green-500 p-2 text-white transition-all duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Update Health Fish Status"
              >
                <FaArrowRight />
              </button>
            </div>
          </motion.div>
          <motion.div
            className="flex items-center space-x-4"
            whileHover="hover"
            whileTap="tap"
            variants={inputVariants}
          >
            <label className="w-1/3 text-right font-semibold text-gray-700">
              <FaHashtag className="mr-2 inline-block text-orange-300" />
              Type:
            </label>
            <input
              type="text"
              value={order.type}
              readOnly
              className="w-2/3 rounded-md bg-gray-100 p-2 text-black transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="VAT"
            />
          </motion.div>
        </div>
        <div className="mt-8 flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-md bg-indigo-600 px-6 py-2 text-white shadow-md transition-all duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            onClick={() => {
              updateOrderStatus();
              updateHealthFishStatus();
            }}
            aria-label="Update Status"
          >
            Update Status
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderDetailsInfo;
