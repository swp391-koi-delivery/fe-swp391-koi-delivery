import React, { useState, useEffect, useRef } from "react";
import {
  Input,
  notification,
  Pagination,
  Select,
  Modal,
  Form,
  InputNumber,
  Typography,
  Alert,
} from "antd";
import { Link } from "react-router-dom";
import {
  FaMoneyBillWave,
  FaChevronRight,
  FaHourglassHalf,
  FaTimesCircle,
  FaTruck,
  FaCheckCircle,
  FaEdit,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaWarehouse,
  FaList,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { MdCancel } from "react-icons/md";
import FeedbackForm from "./feedback";
import api from "../../config/axios";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";
import { FiTruck } from "react-icons/fi";
import useRealTime from "../../hooks/useRealTime";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [newOrderStatus, setNewOrderStatus] = useState("");
  const [totalElements, setTotalElement] = useState(0);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null); //Tạo state để lưu ID của order đang được mở
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái modal
  const [warehouseId, setWarehouseId] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedOption, setSelectedOption] = useState("ALL");
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();
  const ordersPerPage = 3;
  const dropdownRef = useRef(null);
  const { Title, Text } = Typography;
  const [lastMessage, setLastMessage] = useState(null);

  const { Option } = Select;

  const options = [
    {
      value: "All",
      icon: <FaList className="h-4 w-4 text-blue-500" />,
    },
    {
      value: "PENDING",
      icon: <FaHourglassHalf className="h-4 w-4 text-yellow-500" />,
    },
    {
      value: "PAID",
      icon: <FaCheckCircle className="h-4 w-4 text-green-500" />,
    },
    {
      value: "AWAITING_PAYMENT",
      icon: <FaMoneyBillWave className="h-4 w-4 text-orange-500" />,
    },
    {
      value: "BOOKING",
      icon: <FaWarehouse className="h-4 w-4 text-indigo-500" />,
    },
    {
      value: "SHIPPING",
      icon: <FiTruck className="h-4 w-4 text-yellow-500" />,
    },
    {
      value: "CANCELED",
      icon: <MdCancel className="h-4 w-4 text-red-500" />,
    },
    {
      value: "DELIVERED",
      icon: <FaCheckCircle className="h-4 w-4 text-green-500" />,
    },
  ];

  const fetchOrders = async () => {
    try {
      let endpoint;
      switch (selectedOption) {
        case "ALL":
          endpoint = `order/allOrder?page=${currentPage}&size=${ordersPerPage}`;
          break;
        case "PENDING":
          endpoint = `order/listOrderPending?page=${currentPage}&size=${ordersPerPage}`;
          break;
        case "AWAITING_PAYMENT":
          endpoint = `order/listOrderAwaitingPayment?page=${currentPage}&size=${ordersPerPage}`;
          break;
        case "PAID":
          endpoint = `order/listOrderPaid?page=${currentPage}&size=${ordersPerPage}`;
          break;
        case "BOOKING":
          endpoint = `order/listOrderBooking?page=${currentPage}&size=${ordersPerPage}`;
          break;
        case "SHIPPING":
          endpoint = `order/listOrderShipping?page=${currentPage}&size=${ordersPerPage}`;
          break;
        case "DELIVERED":
          endpoint = `order/listOrderDelivered?page=${currentPage}&size=${ordersPerPage}`;
          break;
        case "CANCELED":
          endpoint = `order/listOrderCanceled?page=${currentPage}&size=${ordersPerPage}`;
          break;
        default:
          endpoint = `order/allOrder?page=${currentPage}&size=${ordersPerPage}`;
      }
      const response = await api.get(endpoint);
      const fetchedOrders = response.data?.content || [];
      const totalElements = response.data?.totalElements || 0;
      setOrders(fetchedOrders);
      setFilteredOrders(fetchedOrders);
      console.log(fetchedOrders);
      setTotalElement(totalElements);
    } catch (error) {
      console.error("Error fetching orders:", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch orders.",
      });
    }
  };

  useEffect(() => {
    if (isModalVisible) {
      api
        .get("sale/wareHouse/available")
        .then((response) => {
          setWarehouses(response.data); // Set the fetched warehouses to state
        })
        .catch((error) => {
          message.error("Failed to load warehouse data.");
        });
    }
  }, [isModalVisible]);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, ordersPerPage, selectedOption]); // Chỉ gọi lại khi currentPage hoặc ordersPerPage thay đổi

  useRealTime((body) => {
    const newMessage = body.body;

    // Chỉ hiển thị toast nếu tin nhắn mới khác tin nhắn cuối cùng
    if (newMessage !== lastMessage) {
      setLastMessage(newMessage); // Cập nhật tin nhắn cuối cùng
      if (newMessage === "CUSTOMER CREATE ORDER") {
        toast.success("CUSTOMER CREATE ORDER");
        fetchOrders();
      } else if (newMessage === "CUSTOMER PAYMENT SUCCESS") {
        toast.success("CUSTOMER PAYMENT SUCCESS");
        fetchOrders();
      }
    }
  });

  const handleBookingSubmit = async (warehouseId, orderId) => {
    setSubmitting(true);
    try {
      await api.post(
        `sale/warehouse/bookingSlot?wareHouseId=${warehouseId}&orderId=${orderId}`,
      );
      toast.success("Booking successfully");
      handleModalClose();
      fetchOrders();
    } catch (error) {
      console.error("Error booking slot:", error);
      toast.warning(error.response.data);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      setIsOpen(!isOpen);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown" && isOpen) {
      e.preventDefault();
      const currentIndex = options.findIndex(
        (opt) => opt.value === selectedOption,
      );
      const nextIndex = (currentIndex + 1) % options.length;
      setSelectedOption(options[nextIndex].value);
    } else if (e.key === "ArrowUp" && isOpen) {
      e.preventDefault();
      const currentIndex = options.findIndex(
        (opt) => opt.value === selectedOption,
      );
      const prevIndex = (currentIndex - 1 + options.length) % options.length;
      setSelectedOption(options[prevIndex].value);
    }
  };

  const toggleBookingForm = async (orderId) => {
    setExpandedBookingId(orderId);
    setIsModalVisible(true); // Mở modal
    const response = await api.get(`sale/suggestWareHouse?orderId=${orderId}`);
    toast.success(response.data);
  };

  const handleModalClose = () => {
    setIsModalVisible(false); // Đóng modal
  };

  const toggleContent = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleEditStatus = async (orderId) => {
    try {
      const response = await api.put(`sale/${orderId}`, {
        orderStatus: newOrderStatus,
      });
      notification.success({
        message: "Success",
        description: "Order status updated successfully.",
      });
      // Fetch orders again after successful update
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      notification.error({
        message: "Error",
        description: "Failed to update order status.",
      });
    }
    setEditingOrderId(null); // Close the editing dropdown
  };

  const handleOrderStatusChange = (value) => {
    setNewOrderStatus(value);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await api.delete(`order/${orderId}`);
      notification.success({
        message: "Success",
        description: "Order deleted successfully.",
      });
      fetchOrders(); // Refetch orders after deletion
    } catch (error) {
      console.error("Error deleting order:", error);
      notification.error({
        message: "Error",
        description: "Failed to delete order.",
      });
    }
    setDeletingOrderId(null); // Reset delete state after action
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getOrderStatusIcon = (orderStatus) => {
    switch (orderStatus) {
      case "PENDING":
        return <FaHourglassHalf className="text-yellow-500" />;
      case "CANCELED":
        return <MdCancel className="text-red-500" />;
      case "REJECTED":
        return <FaTimesCircle className="text-red-500" />;
      case "AWAITING_RESPONSE":
        return <FaHourglassHalf className="text-yellow-500" />;
      case "AWAITING_PAYMENT":
        return <FaMoneyBillWave className="text-orange-500" />;
      case "PAID":
        return <FaCheckCircle className="text-green-500" />;
      case "BOOKING":
        return <FaWarehouse className="text-blue-500" />;
      case "SHIPPING":
        return <FaTruck className="text-blue-500" />;
      case "DELIVERED":
        return <FaCheckCircle className="text-green-500" />;
      case "ACCEPTED":
        return <FaCheckCircle className="text-green-500" />; // Assuming "Accepted" has a green checkmark
      default:
        return <FaHourglassHalf className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <div className="mx-auto max-w-2xl space-y-5 rounded-lg bg-white p-4 shadow-md">
        <h1 className="mb-2 text-center text-2xl font-bold text-indigo-800">
          Order Management
        </h1>

        {/* Select bar order Status */}
        <div
          ref={dropdownRef}
          className="relative w-56" // Select occupies 1/4 width
          onKeyDown={handleKeyDown}
          tabIndex="0"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="dropdown-options"
          aria-label="Select status"
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsOpen(!isOpen)}
            className="group flex w-full cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2 text-left shadow-sm transition-all duration-200 ease-in-out hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex items-center space-x-2">
              {options.find((opt) => opt.value === selectedOption)?.icon}
              <span className="block font-medium text-gray-700 group-hover:text-blue-600">
                {selectedOption}
              </span>
            </div>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <IoIosArrowDown className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                id="dropdown-options"
                role="listbox"
                className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-gray-300 bg-white shadow-xl"
                style={{ maxHeight: "10rem", overflowY: "auto" }} // Adjusted max height
              >
                {options.map((option) => (
                  <motion.li
                    key={option.value}
                    role="option"
                    aria-selected={selectedOption === option.value}
                    onClick={() => {
                      setSelectedOption(option.value);
                      setIsOpen(false);
                    }}
                    whileHover={{ backgroundColor: "#F3F4F6" }}
                    className={`flex cursor-pointer items-center space-x-2 px-4 py-2 transition-colors duration-150 ${
                      selectedOption === option.value
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`} // Adjusted padding for compactness
                  >
                    {option.icon}
                    <span className="text-sm font-medium">{option.value}</span>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {totalElements === 0 ? (
          <div className="mt-4 text-center text-sm text-gray-500">
            No orders found matching your criteria.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders?.length > 0 ? (
              filteredOrders.map((order) => {
                const isDelivered = order.status === "DELIVERED";
                const isCanceled = order.status === "CANCELED";
                return (
                  <div
                    key={order.id}
                    className="hover:scale-102 rounded-md bg-gray-100 p-3 shadow-md transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 hover:shadow-xl"
                  >
                    <div className="flex flex-col items-start justify-between space-y-1 md:flex-row md:items-center md:space-y-0">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                          Order ID: {order.id}
                        </h2>
                        <hr className="my-2 border-black" />
                        {order.eachUserResponse && (
                          <>
                            <p className="mt-1 text-sm text-gray-800">
                              Customer Name: {order.eachUserResponse.fullname}
                            </p>
                            <p className="mt-1 text-sm text-gray-800">
                              Customer Phone: {order.eachUserResponse.phone}
                            </p>
                          </>
                        )}
                        <p className="mt-1 text-sm text-gray-800">
                          Tracking Order: {order.trackingOrder}
                        </p>
                        <p className="mt-1 text-sm text-gray-800">
                          From: {order.originLocation}
                        </p>
                        <p className="mt-1 text-sm text-gray-800">
                          To: {order.destinationLocation}
                        </p>
                        <p className="mt-1 text-sm text-gray-800">
                          Total Price: {formatPrice(order.totalPrice)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {editingOrderId === order.id ? (
                            <Select
                              defaultValue={order.orderStatus}
                              onChange={handleOrderStatusChange}
                              className="w-32"
                            >
                              <Option value="ACCEPTED">ACCEPTED</Option>
                              <Option value="REJECTED">REJECTED</Option>
                            </Select>
                          ) : (
                            <>
                              {getOrderStatusIcon(order.orderStatus)}
                              <span className="text-xs font-bold text-gray-700">
                                {order.orderStatus}
                              </span>
                            </>
                          )}
                        </div>
                        {order.orderStatus !== "AWAITING_PAYMENT" &&
                        order.orderStatus !== "BOOKING" &&
                        order.orderStatus !== "SHIPPING" &&
                        order.orderStatus !== "DELIVERED" &&
                        order.orderStatus !== "PAID" &&
                        order.orderStatus !== "CANCELED" ? (
                          <FaEdit
                            className="cursor-pointer text-gray-500"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevents navigating to orderProgress
                              if (editingOrderId === order.id) {
                                handleEditStatus(order.id); // Call to handle editing status
                              } else {
                                setEditingOrderId(order.id); // Set editing order id
                              }
                            }}
                          />
                        ) : null}
                        {/* <FaTrash
                          className="cursor-pointer text-gray-500 hover:text-blue-500"
                          onClick={() => handleDeleteOrder(order.id)} // Trigger delete
                        /> */}
                      </div>
                    </div>
                    <div className="mt-0.5 flex items-center justify-between">
                      <p className="text-sm text-gray-800">
                        Order Date: {order.orderDate}
                      </p>
                      <div className="flex space-x-2">
                        {order.orderStatus === "PAID" && (
                          <button
                            onClick={() => toggleBookingForm(order.id)}
                            className="flex items-center space-x-1 rounded-md bg-green-500 px-2 py-1 text-xs text-white transition-colors duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                          >
                            <span>Booking</span>
                          </button>
                        )}
                        <Link
                          to={`/dashboard/orderDetails/${order.id}`}
                          className="flex items-center space-x-1 rounded-md bg-blue-500 px-2 py-1 text-xs text-white transition-colors duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                          <span>Order Details</span>
                          <FaChevronRight />
                        </Link>
                      </div>
                    </div>

                    {/* Toggle icon */}
                    <div className="mt-2 flex justify-center">
                      {(order.orderStatus === "DELIVERED" ||
                        order.orderStatus === "CANCELED") &&
                        (expandedOrderId === order.id ? (
                          <FaChevronUp
                            className="cursor-pointer text-gray-500"
                            onClick={() => toggleContent(order.id)} // Toggle the content visibility
                          />
                        ) : (
                          <FaChevronDown
                            className="cursor-pointer text-gray-500"
                            onClick={() => toggleContent(order.id)} // Toggle the content visibility
                          />
                        ))}
                    </div>

                    {/* Toggle content */}
                    {expandedOrderId === order.id && (
                      <div className="mt-4 transform text-center text-lg text-gray-700 transition-all duration-500 ease-in-out">
                        {order.orderStatus === "DELIVERED" && (
                          <div className="animate-fadeIn">
                            <FeedbackForm id={order.id} />
                          </div>
                        )}
                        {order.orderStatus === "CANCELED" && (
                          <>
                            <div className="scale-95 transform transition-all hover:scale-100">
                              <Alert
                                message={
                                  <span className="-mt-0.5 flex items-center text-left font-medium">
                                    {/* The message is now aligned with the icon */}
                                    Cancellation Reason :
                                  </span>
                                }
                                description={
                                  <Text
                                    style={{
                                      fontSize: "16px",
                                      color: "#595959",
                                    }}
                                    className="text-left" // Add left padding to space out from the icon
                                  >
                                    {order.failure_reason ||
                                      "Fish health is not good!"}
                                  </Text>
                                }
                                type="error"
                                showIcon
                                style={{
                                  marginTop: "20px",
                                  borderRadius: "10px",
                                }}
                                className="shadow-lg transition-shadow hover:shadow-xl"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Booking warehouse*/}
                    <Modal
                      confirmLoading={submitting}
                      title={`Booking for Order ID: ${expandedBookingId}`}
                      visible={isModalVisible}
                      onCancel={handleModalClose}
                      className="transition-all duration-300 ease-in-out"
                      onOk={() => form.submit()} // Gọi submit của Form khi nhấn OK
                      width={400} // Adjust the modal width
                      bodyStyle={{ padding: "16px" }} // Adjust padding
                    >
                      {/* Form tích hợp trong modal */}
                      <Form
                        form={form}
                        layout="vertical"
                        className="space-y-3"
                        onFinish={() =>
                          handleBookingSubmit(warehouseId, expandedBookingId)
                        }
                      >
                        {/* Warehouse Select */}
                        <Form.Item
                          label="Select Warehouse"
                          name="warehouseId"
                          rules={[
                            {
                              required: true,
                              message: "Warehouse is required",
                            },
                          ]}
                        >
                          <Select
                            value={warehouseId}
                            onChange={setWarehouseId}
                            placeholder="Select Warehouse"
                            className="w-full" // Make the select element take full width
                            showSearch // Enable search functionality
                            filterOption={(input, option) =>
                              option?.children
                                ?.toString()
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            dropdownRender={(menu) => (
                              <div
                                style={{ maxHeight: 200, overflowY: "auto" }}
                              >
                                {menu}
                              </div>
                            )}
                          >
                            {warehouses.map((warehouse) => (
                              <Option key={warehouse.id} value={warehouse.id}>
                                <div className="flex w-full justify-between">
                                  <span>{warehouse.location}</span>
                                  <span className="ml-2 text-right">
                                    📦 {warehouse.bookingCapacity}/
                                    {warehouse.maxCapacity}
                                  </span>
                                </div>
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Form>
                    </Modal>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-sm text-gray-500">
                No orders found.
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Pagination
            current={currentPage}
            total={totalElements}
            pageSize={ordersPerPage}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            className="transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
};

export default OrderList;
