import React, { useState, useEffect } from "react";
import {
  FiPackage,
  FiCheckCircle,
  FiTruck,
  FiMapPin,
  FiHome,
  FiUpload,
  FiAlertCircle,
} from "react-icons/fi";
import {
  CheckCircleOutlined,
  CarryOutOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence, color } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Checkbox, Select } from "antd"; // Import Checkbox from Ant Design
import { toast } from "react-toastify";
import uploadFile from "../../../../utils/file";
import api from "../../../../config/axios";

// Enum for progress status
const ProgressStatus = {
  ON_SITE: "ON_SITE",
  FISH_CHECKED: "FISH_CHECKED",
  WAREHOUSING: "WAREHOUSING",
  EN_ROUTE: "EN_ROUTE",
  HANDED_OVER: "HANDED_OVER",
};

const HealthFishStatus = {
  HEALTHY: "HEALTHY",
  UNHEALTHY: "UNHEALTHY",
};

const OrderTrackingSystem = () => {
  const { id } = useParams();

  const [orderStatus, setOrderStatus] = useState({
    stage: 0,
    events: [],
  });
  const [selectedHealthStatus, setSelectedHealthStatus] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [showHealthInfo, setShowHealthInfo] = useState([]); // Toggle state for each event
  const [isHealthStatusLocked, setIsHealthStatusLocked] = useState(false);
  const [imageFiles, setImageFiles] = useState({});
  const navigate = useNavigate();

  const fetchOrder = async () => {
    try {
      const response = await api.get(`delivery/progress/${id}`);
      const response2 = await api.get(
        `order/listOrderShipping?page=1&size=10000000`,
      );
      const progressData = response.data;
      let orders = response2.data.content;

      console.log("Progress Data:", progressData);
      console.log("Orders Data:", orders);
      console.log("totalElement:", response2.data.totalElements1);

      // // Check if orders is an array, if not try accessing orders list if nested
      // if (!Array.isArray(orders)) {
      //   orders = orders.orders || []; // Adjust to the actual path if nested
      // }

      const order = orders.find((item) => item.id === parseInt(id));
      if (order) {
        setOrderDetails(order);

        const events = progressData.map((progress, index) => ({
          progressId: progress.id,
          status:
            progress.progressStatus || Object.values(ProgressStatus)[index],
          location:
            progress.progressStatus === ProgressStatus.ON_SITE
              ? order.originLocation
              : progress.progressStatus === ProgressStatus.HANDED_OVER
                ? order.destinationLocation
                : null,
          completed: progress.inProgress,
          timestamp: progress.dateProgress,
          image: progress.image,
          healthStatus: progress.healthFishStatus,
          totalBox: progress.totalBox,
          totalVolume: progress.totalVolume,
          canUpload: index === 1 || index === 4, // Enable upload for specific stages
        }));

        const newStage = events.filter((event) => event.completed).length;

        setOrderStatus({
          stage: newStage,
          events,
        });
        setShowHealthInfo(new Array(events.length).fill(false));
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  useEffect(() => {
    const savedStatus = localStorage.getItem(`orderStatus_${id}`);
    if (savedStatus) {
      setSelectedHealthStatus(savedStatus);
      setIsHealthStatusLocked(true); // Lock Select if status is saved
    }
    fetchOrder();
  }, [id]);

  const updateOrderStatus = async (index) => {
    try {
      const nextEvent = orderStatus.events[index];

      if (!nextEvent) return; // Exit if no further stage to update

      // Prepare data for the API call
      const updateData = {
        healthFishStatus: selectedHealthStatus,
        progressStatus: Object.values(ProgressStatus)[index],
        progressId: nextEvent.progressId,
      };

      // Check if the index is either 1 or 4 for image upload
      if (index === 1) {
        const file = imageFiles[index]; // Assuming imageFiles is an array of files

        if (file) {
          // Handle image upload
          const imageUrl = await uploadFile(file);
          console.log("Uploaded image URL:", imageUrl);
          updateData.image = imageUrl; // Include the uploaded image URL

          // Updates the image to its current state
          const updatedEvents = orderStatus.events.map((event, idx) => {
            if (idx === index) {
              return { ...event, image: imageUrl }; // Update the image for the current event
            }
            return event; // Leave other events unchanged
          });

          setOrderStatus((prev) => ({
            ...prev,
            events: updatedEvents,
          }));
        } else {
          toast.error("Please select an image to upload.");
          return; // Exit if no image file is provided
        }
      } else {
        // If not index 1 or 4, use existing image if available
        if (nextEvent.image) {
          updateData.image = nextEvent.image; // Include existing image URL if it exists
        }
      }

      // Make API call to update order status
      await api.put(`delivery/${nextEvent.progressId}`, updateData);

      if (index === 1) {
        localStorage.setItem(`orderStatus_${id}`, selectedHealthStatus); // Save status to localStorage
        setIsHealthStatusLocked(true);

        if (selectedHealthStatus === HealthFishStatus.UNHEALTHY) {
          toast.error("Your order has been canceled!");
          setTimeout(() => {
            navigate(-1); // Back to order page
          }, 1000); // Adjust the timeout duration as needed
          return;
        }
      }
      if (index === 4) {
        setTimeout(() => {
          toast.success("You have successfully delivered!");
          navigate(-1);
        }, 1000);
      }

      // Update the events after a successful API call
      const updatedEvents = orderStatus.events.map((event, idx) => ({
        ...event,
        completed: idx <= index,
        status: Object.values(ProgressStatus)[idx],
      }));

      setOrderStatus({ stage: index + 1, events: updatedEvents });
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleHealthStatusToggle = (index) => {
    const updatedShowHealthInfo = [...showHealthInfo];
    updatedShowHealthInfo[index] = !updatedShowHealthInfo[index];
    setShowHealthInfo(updatedShowHealthInfo);
  };

  const handleHealthStatusChange = (value) => {
    setSelectedHealthStatus(value);
  };

  const handleImageChange = (index, event) => {
    const file = event.target.files[0];
    setImageFiles((prev) => ({ ...prev, [index]: file }));
  };

  const renderIcon = (index) => {
    const icons = [
      FiMapPin, // ON_SITE
      FiCheckCircle, // FISH_CHECKED
      FiPackage, // WAREHOUSING
      FiTruck, // EN_ROUTE
      FiHome, // HANDED_OVER
    ];

    const Icon = icons[index];
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: orderStatus.events[index]?.completed ? 1 : 0.5,
          scale: orderStatus.events[index]?.completed ? 1 : 0.5,
        }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Icon
          className={`h-8 w-8 ${orderStatus.events[index]?.completed ? "text-green-600" : "text-gray-400"}`}
        />
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4 text-gray-800">
      <div className="mx-auto max-w-4xl space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Orders
          </button>
          <div className="rounded-lg bg-gray-100 px-4 py-2 text-lg font-semibold">
            Order ID: <span className="text-blue-600">{id}</span>
          </div>
        </div>

        {/* Icons Display Above Progress Bar */}
        <div className="flex justify-between">
          {orderStatus.events.map((_, index) => (
            <div key={index} className="flex w-1/5 justify-center">
              {renderIcon(index)}
            </div>
          ))}
        </div>

        {/* Stage bar */}
        <div className="relative mt-4">
          <div className="flex h-3 overflow-hidden rounded-full bg-gray-200 text-xs">
            <motion.div
              className="justify-center whitespace-nowrap bg-gradient-to-r from-blue-400 to-green-400 text-center text-white shadow-lg"
              style={{
                width: ` ${(orderStatus.stage / orderStatus.events.length) * 100}%`,
              }}
              initial={{ width: "0%" }}
              animate={{
                width: `${(orderStatus.stage / orderStatus.events.length) * 100}%`,
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Stage tag list */}
        <div className="space-y-4">
          <AnimatePresence>
            {orderStatus.events.map((event, index) => (
              <motion.div
                key={index}
                className={`flex flex-col items-center justify-between rounded-xl p-6 md:flex-row ${event.completed ? "border border-gray-200 bg-gradient-to-r from-gray-50 to-white" : "border border-gray-200 bg-white"} transform transition-all duration-300 hover:scale-[1.02] hover:border-blue-200 hover:shadow-lg`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Flex container for icon and text */}
                <div className="flex h-16 w-16 items-center justify-center">
                  {" "}
                  {/* Adjust width and height for the icon */}
                  {event.status === ProgressStatus.ON_SITE && (
                    <FiMapPin className="text-2xl text-blue-600" />
                  )}
                  {event.status === ProgressStatus.FISH_CHECKED && (
                    <CheckCircleOutlined className="text-2xl text-green-500" />
                  )}
                  {event.status === ProgressStatus.WAREHOUSING && (
                    <ApartmentOutlined className="text-2xl text-red-500" />
                  )}
                  {event.status === ProgressStatus.EN_ROUTE && (
                    <FiMapPin className="text-2xl text-orange-600" />
                  )}
                  {event.status === ProgressStatus.HANDED_OVER && (
                    <CarryOutOutlined className="text-2xl text-green-600" />
                  )}
                </div>

                <div className="flex w-full flex-col gap-4 md:flex-row md:items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <span className="mx-2 text-lg font-medium">
                        {event.status}
                      </span>

                      <p className="ml-2 text-xs text-gray-500">
                        {" "}
                        {/* Add margin for spacing */}
                        {event.timestamp
                          ? new Date(event.timestamp).toLocaleString()
                          : ""}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Health Info for each stage */}
                  <div className="mt-0.5 flex items-center">
                    <Checkbox
                      checked={showHealthInfo[index]}
                      onChange={() => handleHealthStatusToggle(index)}
                    >
                      Information
                    </Checkbox>
                  </div>

                  {/* Health Info Section */}
                  <AnimatePresence>
                    {showHealthInfo[index] && (
                      <motion.div
                        className="mt-2 rounded-md border border-gray-200 p-4"
                        style={{
                          minWidth: "250px", // Set minimum width
                          width: "50%", // Set width to 50% of parent or use a specific pixel value
                          marginLeft: "auto", // Align to the right
                          marginRight: "0", // Remove right margin
                        }}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="flex items-start justify-between">
                          {" "}
                          {/* Flex container for info and image */}
                          <div className="flex-1">
                            {" "}
                            {/* Flex item for health info */}
                            <div>
                              {index === 0 && ( // Display for index 0
                                <>
                                  <p>
                                    Address:{" "}
                                    {event.status === ProgressStatus.ON_SITE
                                      ? orderDetails?.originLocation
                                      : "N/A"}{" "}
                                  </p>
                                  <p>Box: {orderDetails.totalBox}</p>
                                  <p>Volume: {orderDetails.totalVolume}</p>
                                </>
                              )}
                              {index === 1 && ( // Only display dropdown for FISH_CHECKED stage
                                <>
                                  <p>
                                    Health Fish:{" "}
                                    {isHealthStatusLocked ? (
                                      <span
                                        style={{
                                          color:
                                            selectedHealthStatus ===
                                            HealthFishStatus.UNHEALTHY
                                              ? "red"
                                              : "green", // Set color based on health status
                                          display: "flex", // Use flexbox to align icon and text
                                          alignItems: "center", // Center align the items
                                        }}
                                      >
                                        {selectedHealthStatus ===
                                        HealthFishStatus.UNHEALTHY ? (
                                          <>
                                            <FiAlertCircle
                                              style={{ marginRight: "0.5rem" }}
                                            />{" "}
                                            {/* Icon for Unhealthy */}
                                            Unhealthy
                                          </>
                                        ) : (
                                          <>
                                            <FiCheckCircle
                                              style={{ marginRight: "0.5rem" }}
                                            />{" "}
                                            {/* Icon for Healthy */}
                                            Healthy
                                          </>
                                        )}
                                      </span>
                                    ) : (
                                      <Select
                                        value={selectedHealthStatus}
                                        onChange={handleHealthStatusChange}
                                        className="mb-2 w-28"
                                      >
                                        <Select.Option
                                          value={HealthFishStatus.HEALTHY}
                                        >
                                          Healthy
                                        </Select.Option>
                                        <Select.Option
                                          value={HealthFishStatus.UNHEALTHY}
                                        >
                                          Unhealthy
                                        </Select.Option>
                                      </Select>
                                    )}
                                  </p>
                                  <p>Box: {orderDetails.totalBox}</p>
                                  <p>Volume: {orderDetails.totalVolume}</p>

                                  {event.canUpload && !isHealthStatusLocked && (
                                    <div className="flex flex-col">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                          handleImageChange(index, e)
                                        }
                                        aria-label="Upload Health Check Image"
                                      />
                                      {/* Uncomment the button if you want to allow uploading */}
                                    </div>
                                  )}
                                </>
                              )}

                              {index === 3 && ( // Display for index 3
                                <>
                                  <p>
                                    Address:{" "}
                                    {event.status === ProgressStatus.EN_ROUTE
                                      ? orderDetails?.destinationLocation
                                      : "N/A"}
                                  </p>
                                  <p>
                                    Health Fish:{" "}
                                    <span
                                      style={{
                                        color:
                                          selectedHealthStatus ===
                                          HealthFishStatus.UNHEALTHY
                                            ? "red"
                                            : "green", // Set color based on health status
                                        display: "flex", // Use flexbox to align icon and text
                                        alignItems: "center", // Center align the items
                                      }}
                                    >
                                      {selectedHealthStatus ===
                                      HealthFishStatus.UNHEALTHY ? (
                                        <>
                                          <FiAlertCircle
                                            style={{ marginRight: "0.5rem" }}
                                          />{" "}
                                          {/* Icon for Unhealthy */}
                                          Unhealthy
                                        </>
                                      ) : (
                                        <>
                                          <FiCheckCircle
                                            style={{ marginRight: "0.5rem" }}
                                          />{" "}
                                          {/* Icon for Healthy */}
                                          Healthy
                                        </>
                                      )}
                                    </span>
                                  </p>
                                  <p>Box: {orderDetails.totalBox}</p>
                                  <p>Volume: {orderDetails.totalVolume}</p>
                                </>
                              )}

                              {(index === 2 || index === 4) && ( // Display for index 2, 4
                                <>
                                  <p>
                                    Health Fish:{" "}
                                    <span
                                      style={{
                                        color:
                                          selectedHealthStatus ===
                                          HealthFishStatus.UNHEALTHY
                                            ? "red"
                                            : "green", // Set color based on health status
                                        display: "flex", // Use flexbox to align icon and text
                                        alignItems: "center", // Center align the items
                                      }}
                                    >
                                      {selectedHealthStatus ===
                                      HealthFishStatus.UNHEALTHY ? (
                                        <>
                                          <FiAlertCircle
                                            style={{ marginRight: "0.5rem" }}
                                          />{" "}
                                          {/* Icon for Unhealthy */}
                                          Unhealthy
                                        </>
                                      ) : (
                                        <>
                                          <FiCheckCircle
                                            style={{ marginRight: "0.5rem" }}
                                          />{" "}
                                          {/* Icon for Healthy */}
                                          Healthy
                                        </>
                                      )}
                                    </span>
                                  </p>
                                  <p>Box: {orderDetails.totalBox}</p>
                                  <p>Volume: {orderDetails.totalVolume}</p>
                                </>
                              )}
                            </div>
                          </div>
                          {/* Image section, aligned to the right */}
                          {event.image && (
                            <img
                              src={event.image}
                              alt={`Progress ${index}`}
                              className="ml-4 mt-2 h-20 rounded-lg object-cover" // Adjust spacing with margin-left
                            />
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex w-full justify-center md:justify-end">
                  <div className="flex items-center">
                    {event.completed ? (
                      <span style={{ color: "green", fontSize: "1.5rem" }}>
                        ✓
                      </span> // Display tick mark if completed
                    ) : (
                      <Checkbox
                        checked={event.completed}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateOrderStatus(index);
                          }
                        }}
                        style={{
                          transform: "scale(1.5)", // Increase checkbox size
                          marginRight: "10px", // Space between checkbox and tick mark
                        }}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingSystem;
