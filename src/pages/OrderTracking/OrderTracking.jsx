import React, { useState, useEffect } from "react";
import { FiPackage, FiCheckCircle, FiTruck, FiMapPin, FiHome, FiClock, FiBox, FiDollarSign, FiCreditCard, FiHeart, FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const TrackOrder = () => {
  const [orderStatus, setOrderStatus] = useState({
    orderId: "ORD12345",
    orderDate: "2023-06-01",
    originLocation: "New York, NY",
    destinationLocation: "Los Angeles, CA",
    size: "Medium",
    quantity: 2,
    totalPrice: 150.00,
    orderStatus: "InTransit",
    payment: "Credit Card",
    paymentStatus: "Paid",
    healthFishStatus: "Excellent",
    vat: 15.00,
    stage: 3,
    events: [
      { status: "PendingConfirmation", timestamp: "2023-06-01 10:00 AM", completed: true },
      { status: "OrderConfirmed", timestamp: "2023-06-01 11:30 AM", completed: true },
      { status: "PackingInProgress", timestamp: "2023-06-02 09:15 AM", completed: true },
      { status: "InTransit", timestamp: "2023-06-03 14:30 PM", completed: false },
      { status: "Delivered", timestamp: "", completed: false },
    ],
  });

  const [searchOrderId, setSearchOrderId] = useState("");
  const [foundOrder, setFoundOrder] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      updateOrderStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = () => {
    setOrderStatus((prevStatus) => {
      const newStage = Math.min(prevStatus.stage + 1, 4);
      const updatedEvents = prevStatus.events.map((event, index) => {
        if (index <= newStage) {
          return { ...event, completed: true, timestamp: getCurrentTimestamp() };
        }
        return event;
      });

      return { 
        ...prevStatus,
        stage: newStage, 
        events: updatedEvents,
        orderStatus: updatedEvents[newStage].status
      };
    });
  };

  const getCurrentTimestamp = () => {
    const now = new Date();
    return now.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getProgressPercentage = () => {
    return (orderStatus.stage / 4) * 100;
  };

  const renderIcon = (index) => {
    const icons = [FiClock, FiCheckCircle, FiBox, FiTruck, FiHome];
    const Icon = icons[index];
    return (
      <Icon
        className={`w-8 h-8 ${orderStatus.events[index].completed ? "text-green-400" : "text-gray-400"}`}
      />
    );
  };

  const handleSearch = () => {
    // Simulating an API call to find the order
    setTimeout(() => {
      if (searchOrderId === orderStatus.orderId) {
        setFoundOrder(orderStatus);
      } else {
        setFoundOrder(null);
        alert("Order not found");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-gray-800 rounded-lg shadow-lg p-6 space-y-8">
        <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">Track Your Order</h1>

        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Enter Order ID"
            className="flex-grow bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchOrderId}
            onChange={(e) => setSearchOrderId(e.target.value)}
          />
          <motion.button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
          >
            <FiSearch className="w-5 h-5" />
          </motion.button>
        </div>

        {foundOrder && (
          <>
            <div className="relative">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
                <motion.div
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-green-400 to-blue-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${getProgressPercentage()}%` }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
              <div className="flex justify-between text-sm mt-2">
                {foundOrder.events.map((event, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center ${index === foundOrder.stage ? "text-green-400" : ""}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="cursor-pointer transition-all duration-300 ease-in-out"
                      role="button"
                      tabIndex={0}
                      aria-label={`${event.status} details`}
                      onClick={() => alert(`${event.status}: ${event.timestamp || "Not reached yet"}`)}
                    >
                      {renderIcon(index)}
                    </motion.div>
                    <span className="mt-2 text-xs text-center">{event.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {foundOrder.events.map((event, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg ${event.completed ? "bg-gray-700" : "bg-gray-800"}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center space-x-4">
                      {renderIcon(index)}
                      <span className="font-medium">{event.status}</span>
                    </div>
                    <span className="text-sm text-gray-400">{event.timestamp || "Pending"}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <motion.div 
              className="bg-gray-700 rounded-lg p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-600">Order Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <FiPackage className="text-blue-400" />
                  <span>Order ID: {foundOrder.orderId}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiClock className="text-yellow-400" />
                  <span>Order Date: {foundOrder.orderDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiMapPin className="text-red-400" />
                  <span>Origin: {foundOrder.originLocation}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiHome className="text-green-400" />
                  <span>Destination: {foundOrder.destinationLocation}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiBox className="text-purple-400" />
                  <span>Size: {foundOrder.size}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiPackage className="text-indigo-400" />
                  <span>Quantity: {foundOrder.quantity}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiDollarSign className="text-green-400" />
                  <span>Total Price: ${foundOrder.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiTruck className="text-blue-400" />
                  <span>Status: {foundOrder.orderStatus}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiCreditCard className="text-yellow-400" />
                  <span>Payment: {foundOrder.payment}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiCheckCircle className="text-green-400" />
                  <span>Payment Status: {foundOrder.paymentStatus}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiHeart className="text-red-400" />
                  <span>Health Status: {foundOrder.healthFishStatus}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiDollarSign className="text-gray-400" />
                  <span>VAT: ${foundOrder.vat.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>

            <div className="flex justify-center">
              <motion.button
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={updateOrderStatus}
              >
                Refresh Status
              </motion.button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
