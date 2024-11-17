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
import { MdCancel, MdLocalShipping } from "react-icons/md";
import { IoWarning } from "react-icons/io5";
import { BiLoaderAlt } from "react-icons/bi";
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

const reasons = [
  "Wrong delivery address",
  "Delivery delayed",
  "Order damaged during shipping",
  "Incorrect order items",
  "Other",
];

const OrderTrackingSystem = () => {
  const { id } = useParams();

  const [orderStatus, setOrderStatus] = useState({
    stage: 0,
    events: [],
  });
  const [selectedHealthStatus, setSelectedHealthStatus] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [showHealthInfo, setShowHealthInfo] = useState([]); // Toggle state for each event
  const [showImg, setShowImg] = useState([]); // Toggle state for each event
  const [isHealthStatusLocked, setIsHealthStatusLocked] = useState(false);
  const [imageFiles, setImageFiles] = useState({});
  const [uploadLocked, setUploadLocked] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [otherReason, setOtherReason] = useState(""); // State for "Other" reason

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
          canUpload: index === 1 || index === 2 || index === 3 || index === 4, // Enable upload for specific stages
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

  const handleCancelOrder = async () => {
    let reason = cancellationReason;

    // Nếu chọn "Other", sử dụng lý do từ textarea
    if (cancellationReason === "Other") {
      if (!otherReason.trim()) {
        setError("Please specify your reason for cancellation");
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 3000);
        return;
      }
      reason = otherReason; // Sử dụng lý do nhập vào
    }

    if (!reason) {
      setError("Please select a reason for cancellation");
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const progressEvent = orderStatus.events.find(
        (event) =>
          event.status === Object.values(ProgressStatus)[orderStatus.stage - 1],
      );

      if (!progressEvent) {
        throw new Error("No progress event found to cancel.");
      }

      const { progressId } = progressEvent;

      // Gửi yêu cầu DELETE với lý do hủy đơn hàng
      await api.delete(`delivery/${progressId}`, {
        params: {
          reason,
        },
      });

      setShowConfirmation(false);
      setCancellationReason("");
      setOtherReason(""); // Reset textarea
      setIsHealthStatusLocked(true);
      toast.error("Your order has been canceled!");
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    } catch (err) {
      setError(err.message);
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (index) => {
    try {
      // Kiểm tra nếu chưa hoàn thành giai đoạn trước đó
      if (index !== orderStatus.stage) {
        toast.error("You need to complete the previous stage first.");
        return;
      }

      const nextEvent = orderStatus.events[index];
      if (!nextEvent) return; // Không có giai đoạn tiếp theo để cập nhật

      const updateData = {
        healthFishStatus: selectedHealthStatus,
        progressStatus: Object.values(ProgressStatus)[index],
        progressId: nextEvent.progressId,
      };

      // Xử lý upload hình ảnh cho các giai đoạn cụ thể
      if ([1, 2, 3, 4].includes(index)) {
        const file = imageFiles[index];

        if (file) {
          // Upload file nếu người dùng chọn ảnh mới
          const imageUrl = await uploadFile(file);
          updateData.image = imageUrl; // Lưu lại ảnh mới tải lên
        } else {
          // Nếu không có ảnh mới, sử dụng ảnh cũ đã có
          updateData.image = nextEvent.image || null;
        }
      }

      // Gọi API để cập nhật trạng thái
      await api.put(`delivery/${nextEvent.progressId}`, updateData);

      if (index === 1) {
        localStorage.setItem(`orderStatus_${id}`, selectedHealthStatus);
        setIsHealthStatusLocked(true);

        if (selectedHealthStatus === HealthFishStatus.UNHEALTHY) {
          toast.error("Your order has been canceled!");
          setTimeout(() => {
            navigate(-1);
          }, 1000);
          return;
        }
      }

      if (index === 4) {
        toast.success("You have successfully delivered!");
        setTimeout(() => {
          navigate(-1);
        }, 1000);
      }

      // Cập nhật trạng thái sự kiện
      const updatedEvents = orderStatus.events.map((event, idx) => ({
        ...event,
        completed: idx <= index,
        timestamp:
          idx === index ? new Date().toLocaleString() : event.timestamp,
      }));

      setOrderStatus({ stage: index + 1, events: updatedEvents });

      // Khóa upload cho giai đoạn hiện tại sau khi chuyển trạng thái
      setUploadLocked((prev) => {
        const newLocked = { ...prev };
        if (index >= 2 && index <= 4) {
          newLocked[index] = true;
        }
        return newLocked;
      });
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
    setImageFiles((prev) => {
      const updatedFiles = { ...prev };
      updatedFiles[index] = file;

      //  Automatically update photos as soon as a file is selected
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const updatedEvents = [...orderStatus.events];
          updatedEvents[index] = {
            ...updatedEvents[index],
            image: reader.result, // Save image as base64
          };
          setOrderStatus({ ...orderStatus, events: updatedEvents });
        };
        reader.readAsDataURL(file);
      }
      return updatedFiles;
    });
  };

  // Call image to render
  const renderImage = (event, index) => {
    if (event.image) {
      return (
        <img
          src={event.image}
          alt={`Progress ${index}`}
          className="h-20 rounded-lg object-cover"
        />
      );
    }
    return null; // Return nothing if there's no image
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
                        {event.timestamp}
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
                        className="mt-2 rounded-md border border-gray-300 p-4"
                        style={{
                          minWidth: "300px", // Set minimum width
                          width: "60%", // Set width to 50% of parent or use a specific pixel value
                          marginLeft: "auto", // Align to the right
                          marginRight: "0", // Remove right margin
                        }}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="flex items-center justify-start space-x-3">
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
                                    {isHealthStatusLocked && index === 1 ? (
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

                                  {/* Upload Section */}
                                  <div className="flex-shrink-0">
                                    {/* Check if event is completed and no image uploaded */}
                                    {event.completed && !event.image ? (
                                      <p className="text-red-500">
                                        No image upload!
                                      </p> // Show message if event is completed but no image is uploaded
                                    ) : event.completed &&
                                      event.image ? null : ( // Display the uploaded image if it's available
                                      // Show file upload input only if no image and canUpload is true
                                      !event.image &&
                                      event.canUpload && (
                                        <div className="flex flex-col">
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                              handleImageChange(index, e)
                                            } // Handle file change
                                            aria-label="Upload Health Check Image"
                                          />
                                        </div>
                                      )
                                    )}
                                  </div>
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
                                    {isHealthStatusLocked && (
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
                                    )}
                                  </p>
                                  <p>Box: {orderDetails.totalBox}</p>
                                  <p>Volume: {orderDetails.totalVolume}</p>
                                  {/* Upload Section */}
                                  <div className="flex-shrink-0">
                                    {/* Check if event is completed and no image uploaded */}
                                    {event.completed && !event.image ? (
                                      <p className="text-red-500">
                                        No image upload!
                                      </p> // Show message if event is completed but no image is uploaded
                                    ) : event.completed &&
                                      event.image ? null : ( // Display the uploaded image if it's available
                                      // Show file upload input only if no image and canUpload is true
                                      !event.image &&
                                      event.canUpload && (
                                        <div className="flex flex-col">
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                              handleImageChange(index, e)
                                            } // Handle file change
                                            aria-label="Upload Health Check Image"
                                          />
                                        </div>
                                      )
                                    )}
                                  </div>
                                </>
                              )}

                              {(index === 2 || index === 4) && ( // Display for index 2, 4
                                <>
                                  <p>
                                    Health Fish:{" "}
                                    {isHealthStatusLocked && (
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
                                    )}
                                  </p>
                                  <p>Box: {orderDetails.totalBox}</p>
                                  <p>Volume: {orderDetails.totalVolume}</p>
                                  {/* Upload Section */}
                                  <div className="flex-shrink-0">
                                    {/* Check if event is completed and no image uploaded */}
                                    {event.completed && !event.image ? (
                                      <p className="text-red-500">
                                        No image upload!
                                      </p> // Show message if event is completed but no image is uploaded
                                    ) : event.completed &&
                                      event.image ? null : ( // Display the uploaded image if it's available
                                      // Show file upload input only if no image and canUpload is true
                                      !event.image &&
                                      event.canUpload && (
                                        <div className="flex flex-col">
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                              handleImageChange(index, e)
                                            } // Handle file change
                                            aria-label="Upload Health Check Image"
                                          />
                                        </div>
                                      )
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          {/* Image */}
                          {renderImage(event, index)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Tick Check BOX */}
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
                          // Only allow tick if health status is selected (index === 1)
                          if (index === 1 && !selectedHealthStatus) {
                            alert("Please check the health fish status!");
                            return; // Prevent updating if health status is not selected
                          }
                          if (e.target.checked) {
                            updateOrderStatus(index);
                          }
                        }}
                        disabled={index === 1 && !selectedHealthStatus} // Disable checkbox if no health status selected
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

        {/*Delete order progress */}
        <div className="relative flex justify-center">
          <button
            onClick={() => setShowConfirmation(true)}
            className="group relative inline-flex transform items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-base font-medium text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
            aria-label="Cancel Order"
            role="button"
          >
            {isLoading ? (
              <BiLoaderAlt className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <MdCancel className="mr-2 h-5 w-5" />
            )}
            Cancel Order
          </button>

          {error && showTooltip && (
            <div className="absolute -top-12 left-1/2 flex -translate-x-1/2 transform animate-bounce items-center space-x-2 rounded-lg bg-red-100 px-4 py-2 text-red-800 shadow-md">
              <IoWarning className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {showConfirmation && (
            <div className="fixed inset-0 z-50 flex h-full items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="animate-modal-appear w-full max-w-md transform rounded-2xl bg-white p-8 shadow-2xl transition-all duration-300 ease-in-out">
                <div className="mb-6 flex items-center space-x-4">
                  <MdLocalShipping className="h-10 w-10 text-purple-500" />
                  <div>
                    <h3 className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-2xl font-bold text-gray-900 text-transparent">
                      Cancel Delivery Order
                    </h3>
                    <p className="text-gray-600">
                      Please select your reason for cancellation
                    </p>
                  </div>
                </div>

                <div className="mb-6 space-y-4">
                  {reasons.map((reason, index) => (
                    <label
                      key={index}
                      className={`flex cursor-pointer items-center rounded-lg border-2 p-4 transition-all duration-200 ${
                        cancellationReason === reason
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-200 hover:bg-purple-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="cancellationReason"
                        value={reason}
                        checked={cancellationReason === reason}
                        onChange={(e) => setCancellationReason(e.target.value)}
                        className="hidden"
                      />
                      <div className="w-full">
                        <span className="font-medium text-gray-700">
                          {reason}
                        </span>
                      </div>
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                          cancellationReason === reason
                            ? "border-purple-500 bg-purple-500"
                            : "border-gray-300"
                        }`}
                      >
                        {cancellationReason === reason && (
                          <div className="h-3 w-3 rounded-full bg-white" />
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                {cancellationReason === "Other" && (
                  <textarea
                    className="mb-6 w-full rounded-lg border-2 border-gray-200 p-3 transition-all duration-200 focus:border-purple-500 focus:ring focus:ring-purple-200"
                    placeholder="Please specify your reason..."
                    rows="3"
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                  />
                )}

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setShowConfirmation(false);
                      setCancellationReason("");
                    }}
                    className="flex transform items-center rounded-lg bg-gray-200 px-6 py-3 font-medium text-black transition-all duration-300 hover:scale-105 hover:bg-gray-300"
                  >
                    Keep Order
                  </button>
                  <button
                    onClick={handleCancelOrder}
                    className="flex transform items-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:from-purple-600 hover:to-pink-600"
                  >
                    {isLoading && (
                      <BiLoaderAlt className="mr-2 h-5 w-5 animate-spin" />
                    )}
                    Confirm Cancellation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingSystem;
