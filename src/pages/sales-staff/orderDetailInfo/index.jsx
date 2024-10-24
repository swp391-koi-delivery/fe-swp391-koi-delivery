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
  FaRuler,
  FaHashtag,
  FaBoxes,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import api from "../../../config/axios";

function OrderDetailsInfoStaff() {
    const { id } = useParams(); // Get orderId from URL
    const [order, setOrder] = useState(null); // Initialize as null to check for data loading
    const [loading, setLoading] = useState(true); // Loading state to show a loader or fallback
  
    const fetchOrder = async () => {
      try {
        const response = await api.get(`order/allOrder?page=1&size=1000000000`);
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
  
    const formatPrice = (price) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);
    };
    const inputVariants = {
      hover: { scale: 1.05, transition: { duration: 0.3 } },
      tap: { scale: 0.95 },
    };
  
    const changeOrderStatus = async () => {
      const statuses = ["SHIPPING", "DELIVERED"];
      const currentIndex = statuses.indexOf(order.orderStatus);
      const nextIndex = (currentIndex + 1) % statuses.length;
      setOrder({ ...order, orderStatus: statuses[nextIndex] });
    };
  
    const changeHealthFishStatus = async () => {
      const statuses = ["HEALTHY", "UNHEALTHY"];
      const currentIndex = statuses.indexOf(order.healthFishStatus);
      const nextIndex = (currentIndex + 1) % statuses.length;
      setOrder({ ...order, healthFishStatus: statuses[nextIndex] });
    };
  
    const updateOrderStatus = async (id, newStatus) => {
      try {
        await api.put(`order/${id}`, {
          orderStatus: newStatus, // Dynamically set the field name
        });
        notification.success({
          message: "Success",
          description: "Order status updated successfully.",
        });
        // Fetch orders again after successful update
        fetchOrders();
      } catch (error) {
        console.error("Error updating Order status:", error);
        notification.error({
          message: "Error",
          description: "Failed to update Order status.",
        });
      }
    };
  
    const updateHealthFishStatus = async (id, newStatus) => {
      try {
        await api.put(`delivery/${id}`, {
          healthFishStatus: newStatus, 
        });
        notification.success({
          message: "Success",
          description: "Health Fish Status updated successfully.",
        });
        // Fetch orders again after successful update
        fetchOrders();
      } catch (error) {
        console.error("Error updating Health Fish Status:", error);
        notification.error({
          message: "Error",
          description: "Failed to update Health Fish Status.",
        });
      }
    };
  
    const formatDateToInput = (dateString) => {
      const [day, month, year] = dateString.split("/");
      return `${year}-${month}-${day}`; // Return yyyy-MM-dd
    };
  
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-200 to-indigo-200 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl rounded-xl bg-white p-8 shadow-2xl"
        >
          <h1 className="mb-6 text-center text-3xl font-bold text-indigo-700">
            Order Details
          </h1>
          {order.orderDetails.length > 0 ? (
            order.orderDetails.map((detail, index) => (
              <div key={index} className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                    <FaCalendarAlt className="mr-2 inline-block text-indigo-400" />
                    Order Date:
                  </label>
                  <input
                    type="date"
                    value={formatDateToInput(order.orderDate)} // Sử dụng hàm để định dạng cho input
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
                    value={detail.origin}
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
                    <FaHashtag className="mr-2 inline-block text-orange-300" />
                    nameFarm:
                  </label>
                  <input
                    type="text"
                    value={detail.nameFarm}
                    readOnly
                    className="w-2/3 rounded-md bg-gray-100 p-2 text-black transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="VAT"
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
                    Farm Address:
                  </label>
                  <input
                    type="text"
                    value={detail.farmAddress}
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
                    <FaRuler className="mr-2 inline-block text-purple-500" />
                    Size Of Fish:
                  </label>
                  <input
                    type="text"
                    value={detail.sizeOfFish}
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
                    Number Of Fish:
                  </label>
                  <input
                    type="number"
                    value={detail.numberOfFish}
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
                    value={`${formatPrice(order.totalPrice)}`}
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
                    <FaBox className="mr-2 inline-block text-amber-500" />
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
                    <FaBoxes className="mr-2 inline-block text-blue-300" />
                    Box:
                  </label>
                  <input
                    type="text"
                    value={detail.totalBox}
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
                    {/* <button
                      onClick={changeOrderStatus}
                      className="rounded-r-md bg-indigo-500 p-2 text-white transition-all duration-300 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label="Update Order Status"
                    >
                      <FaArrowRight />
                    </button> */}
                  </div>
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
                      value={detail.healthFishStatus}
                      readOnly
                      className="w-full rounded-l-md bg-gray-100 p-2 text-black transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label="Health Fish Status"
                    />
                    {/* <button
                      onClick={changeHealthFishStatus}
                      className="rounded-r-md bg-green-500 p-2 text-white transition-all duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                      aria-label="Update Health Fish Status"
                    >
                      <FaArrowRight />
                    </button> */}
                  </div>
                </motion.div>
              </div>
            ))
          ) : (
            <p>No order details available.</p>
          )}
          {/* <div className="mt-8 flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-md bg-indigo-600 px-6 py-2 text-white shadow-md transition-all duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              onClick={() => {
                updateOrderStatus(order.id, order.orderStatus);
                updateHealthFishStatus(
                  order.id,
                  order.healthFishStatus,
                );
              }}
              aria-label="Update Status"
            >
              Update Status
            </motion.button>
          </div> */}
        </motion.div>
      </div>
    );
}

export default OrderDetailsInfoStaff