import React, { useState, useEffect } from "react";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaNotesMedical,
  FaBoxOpen,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaFish,
  FaInfoCircle,
  FaBox,
  FaRuler,
  FaWarehouse,
  FaBoxes,
  FaArrowLeft,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import api from "../../../../../config/axios";
import { toast } from "react-toastify";
import { Modal, Button } from "antd";

const OrderDetailsInfo = () => {
  // OrderDetailsInfo
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  //BoxDetails
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const fetchOrder = async () => {
    try {
      const responses = await Promise.all([
        api.get("order/listOrderShipping"),
        api.get("order/listOrderPaid"),
        api.get("order/listOrderDelivered"),
      ]);

      const fetchedOrders = responses
        .map((response) => response?.data.content || []) // Use an empty array if data is undefined
        .flat(); // Flatten the resulting array of arrays

      console.log(fetchedOrders);

      const foundOrder = fetchedOrders.find((item) =>
        item.orderDetails.some((detail) => detail.id === parseInt(id)),
      );

      if (foundOrder) {
        const matchingDetails = foundOrder.orderDetails.filter(
          (detail) => detail.id === parseInt(id),
        );
        setOrder({ ...foundOrder, orderDetails: matchingDetails });
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
    }).format(price);
  };

  const inputVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  const formatDateToInput = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`; // Return yyyy-MM-dd
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 p-4">
      {order.orderDetails.length > 0 ? (
        order.orderDetails.map((detail, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl rounded-xl bg-white p-8 shadow-2xl"
          >
            <h1 className="mb-6 text-center text-3xl font-bold text-indigo-700">
              Order Details
            </h1>

            <div key={index} className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <motion.div
                className="flex items-center space-x-4"
                whileHover="hover"
                whileTap="tap"
                variants={inputVariants}
              >
                <label className="w-1/3 text-right font-semibold text-gray-700">
                  <FaInfoCircle className="text-grey-200 mr-2 inline-block" />
                  ID:
                </label>
                <input
                  type="text"
                  value={detail.id}
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
                  value={formatDateToInput(order.orderDate)} // Use function to format input
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
                  <FaWarehouse className="mr-2 inline-block text-blue-700" />
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
                  <FaFish className="mr-2 inline-block text-green-500" />
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
                  Price Of Fish:
                </label>
                <input
                  type="text"
                  value={formatPrice(detail.priceOfFish)}
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
                  value={detail.totalVolume}
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
                  <FaBoxOpen className="mr-2 inline-block text-amber-800" />
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

              {/*Box Details here */}
              <motion.div
                className="flex items-center space-x-4"
                whileHover="hover"
                whileTap="tap"
                variants={inputVariants}
              >
                <label className="w-1/3 text-right font-semibold text-gray-700">
                  <FaBoxes className="mr-2 inline-block text-teal-500" />
                  Box Details:
                </label>
                <Button
                  className="btn-box_deli flex items-center rounded-lg border border-blue-500 bg-white px-4 py-2 text-blue-500 shadow-md transition duration-300 ease-in-out hover:bg-blue-500 hover:text-white"
                  onClick={showModal}
                >
                  {/* You can replace this with an actual icon */}
                  Show Box Details
                </Button>

                <Modal
                  title={
                    <span className="font-bold text-black">Box Detail: </span>
                  }
                  visible={isModalVisible}
                  onCancel={handleCancel}
                  footer={null}
                  className="modal-custom"
                >
                  <div className="p-4">
                    <div className="grid gap-4">
                      {detail.boxDetails.map((box) => (
                        <div
                          key={box.id}
                          className="flex items-center justify-between rounded-lg bg-blue-500 p-4 font-semibold text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-400 hover:shadow-lg"
                        >
                          <Link
                            to={`/deliveryStaff/boxDetails_Deli/${box.boxes.id}`}
                            className="flex-grow text-white transition duration-300 ease-in-out hover:text-white"
                          >
                            <span className="mr-2">📦</span>{" "}
                            <span className="mr-2">Box ID: {box.id}</span>
                          </Link>
                          <span className="ml-auto text-white">
                            {box.boxes.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Modal>
              </motion.div>

              {/* End. */}
              <motion.div
                className="flex items-center space-x-4"
                whileHover="hover"
                whileTap="tap"
                variants={inputVariants}
              >
                <label className="w-1/3 text-right font-semibold text-gray-700">
                  <FaNotesMedical className="mr-2 inline-block text-green-500" />
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
                </div>
              </motion.div>
            </div>

            <div className="mt-8 flex justify-center space-x-4"></div>
          </motion.div>
        ))
      ) : (
        <p>Error</p>
      )}
    </div>
  );
};

export default OrderDetailsInfo;
