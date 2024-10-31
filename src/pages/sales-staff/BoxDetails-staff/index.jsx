import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBox, FaArrowRight, FaDollarSign, FaCube,FaMoneyBill } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../config/axios";

function BoxDetailsStaff() {
    const [isHovered, setIsHovered] = useState(false);
    const [boxData, setBoxData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams(); // Assuming the box ID is passed via route parameters
    const navigate = useNavigate(); // To handle navigation
  
    const fetchBoxData = async () => {
      try {
        const responses = await Promise.all([
          api.get("order/allOrder?page=1&size=1000000000"),
        ]);
  
        const fetchedOrders = responses
          .map((response) => response?.data.content || []) // Use an empty array if data is undefined
          .flat(); // Flatten the resulting array of arrays
  
        const data = fetchedOrders;
        console.log(data);
        // Find the order containing the desired box
        const foundOrder = data.find((item) =>
          item.orderDetails.some((detail) =>
            detail.boxDetails.some(
              (boxDetail) => boxDetail.boxes.id === parseInt(id),
            ),
          ),
        );
  
        // Find box based on ID
        if (foundOrder) {
          const foundBox = foundOrder.orderDetails
            .flatMap((detail) => detail.boxDetails)
            .find((boxDetail) => boxDetail.boxes.id === parseInt(id));
  
          if (foundBox) {
            setBoxData({
              id: foundBox.id,
              type: foundBox.boxes.type,
              volume: foundBox.boxes.volume,
              price: foundBox.boxes.price,
              quantity: foundBox.quantity,
            });
          } else {
            setBoxData(null);
          }
        } else {
          setBoxData(null);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching box data:", error);
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchBoxData();
    }, [id]);
  
    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      );
    }
  
    if (!boxData) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          Box not found
        </div>
      );
    }
  
    const formatPrice = (price) => {
      return new Intl.NumberFormat("en-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    };
  
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 p-4">
        <motion.div
          className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <div className="relative h-36 bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <motion.div
              className="absolute inset-0 bg-black opacity-0"
              animate={{ opacity: isHovered ? 0.1 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white" role="heading">
                  {boxData.type}
                </h2>
                <p className="mt-2 text-blue-100">Box ID: {boxData.id}</p>
              </div>
              <FaBox className="text-4xl text-white" />
            </div>
          </div>
  
          <div className="space-y-6 p-6">
            <motion.div
              className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-3">
                <FaCube className="text-xl text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Volume</p>
                  <p className="font-semibold text-gray-900">{boxData.volume}</p>
                </div>
              </div>
              <FaArrowRight className="text-gray-400" />
            </motion.div>
  
            <motion.div
              className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-3">
                <FaMoneyBill className="text-xl text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-semibold text-gray-900">
                    {formatPrice(boxData.price)}
                  </p>
                </div>
              </div>
              <FaArrowRight className="text-gray-400" />
            </motion.div>
  
            <motion.div
              className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <span className="font-semibold text-blue-600">
                    {boxData.quantity}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quantity</p>
                  <p className="font-semibold text-gray-900">Units</p>
                </div>
              </div>
              <FaArrowRight className="text-gray-400" />
            </motion.div>
          </div>
  
          <motion.button
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 py-4 text-lg font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            aria-label="Back"
            onClick={() => navigate(-1)} // Navigate back to the previous page
          >
            &lt;&lt; Back to previous page
          </motion.button>
        </motion.div>
      </div>
    );
}

export default BoxDetailsStaff