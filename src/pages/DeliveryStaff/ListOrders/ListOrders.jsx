import React, { useState, useEffect, useRef } from "react";
import { Slider, Input, notification, Pagination, Select } from "antd";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaCreditCard,
  FaMoneyBillWave,
  FaChevronRight,
  FaHourglassHalf,
  FaTruck,
  FaCheckCircle,
  FaEdit,
  FaChevronDown,
  FaChevronUp,
  FaList,
  FaWarehouse
} from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";
import {  FiTruck } from "react-icons/fi";
import useRealTime from "../../../hooks/useRealTime";

const { Option } = Select;

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [newOrderStatus, setNewOrderStatus] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("BOOKING");
  const dropdownRef = useRef(null);
  const ordersPerPage = 3;

  const options = [
    {
      value: "BOOKING",
      icon: <FaWarehouse className="h-4 w-4 text-indigo-500" />,
    },
    {
      value: "SHIPPING",
      icon: <FiTruck className="h-4 w-4 text-orange-500" />,
    },
    {
      value: "DELIVERED",
      icon: <FaCheckCircle className="h-4 w-4 text-green-500" />,
    },
    {
      value: "CANCELED",
      icon: <MdCancel className="h-4 w-4 text-red-500" />,
    },
  ];

  const fetchOrders = async () => {
    try {
      let endpoint;
      switch (selectedOption) {      
        case "SHIPPING":
          endpoint = `order/listOrderShipping?page=${currentPage}&size=${ordersPerPage}`;
          break;
        case "BOOKING":
          endpoint = `order/listOrderBooking?page=${currentPage}&size=${ordersPerPage}`;
          break;
        case "DELIVERED":
          endpoint = `order/listOrderDelivered?page=${currentPage}&size=${ordersPerPage}`;
          break;
        case "CANCELED":
          endpoint = `order/listOrderCanceled?page=${currentPage}&size=${ordersPerPage}`;
          break;
        default:
          endpoint = `order/listOrderBooking?page=${currentPage}&size=${ordersPerPage}`;
      }

      const response = await api.get(endpoint);
      const fetchedOrders = response.data?.content || [];
      const totalElements = response.data?.totalElements || 0;

      setOrders(fetchedOrders);
      setFilteredOrders(fetchedOrders);
      setTotalElements(totalElements);

      console.log("order: ", fetchedOrders);
      setPriceRange([
        0,
        Math.max(...fetchedOrders.map((order) => order.totalPrice)),
      ]);
    } catch (error) {
      console.error("Error fetching orders:", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch orders.",
      });
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

  useEffect(() => {
    fetchOrders(); // Fetch orders on component mount
  }, [currentPage, ordersPerPage, selectedOption]); // Dependency array should include only dependencies that control the fetch logic

  useRealTime((body) => {
    if (
      body.body === "SALE BOOKING SLOT WAREHOUSE"
    ) {
      fetchOrders();
      toast.success("SALE BOOKED ORDER SUCCESSFULLY");
    }
  });

  useEffect(() => {
    if (orders.length === 0) return; // Avoid running filter on an empty array
    const filtered = orders.filter((order) => {
      const orderId = String(order.id);
      return (
        orderId.toLowerCase().includes(searchTerm.toLowerCase()) &&
        order.totalPrice >= priceRange[0] &&
        order.totalPrice <= priceRange[1]
      );
    });
    setFilteredOrders(filtered);
  }, [searchTerm, priceRange]); // Only depend on changes to orders, searchTerm, and priceRange

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const postProgressOrder = async (id) => {
    try {
      await api.post(
        "delivery/progress",
        { orderId: id }, // Wrap the id in an object if this is the expected structure on the backend
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      fetchOrders(); // Fetch orders after successfully updating
    } catch (error) {
      console.error("Error updating order progress:", error);
      toast.error("Failed to update progress");
    }
  };

  const handleEditStatus = async (id) => {
    try {
      await api.put(`delivery/order/${id}`, {
        orderStatus: newOrderStatus,
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, orderStatus: newOrderStatus } : order,
        ),
      );
      setFilteredOrders((prevFilteredOrders) =>
        prevFilteredOrders.map((order) =>
          order.id === id ? { ...order, orderStatus: newOrderStatus } : order,
        ),
      );

      toast.success("Update successfully");

      // Only post progress if the new order status is SHIPPING
      if (newOrderStatus === "SHIPPING") {
        await postProgressOrder(id);
        // toast.success("Progress have been Created");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Update failed");
    }
    setEditingOrderId(null); // Close the edit menu
  };

  const handleOrderStatusChange = (value) => {
    setNewOrderStatus(value);
  };

  const getPaymentMethodIcon = (method) => {
    if (!method) return null;
    switch (method) {
      case "BANK_TRANSFER":
        return <FaCreditCard className="text-purple-500" />;
      case "CASH":
        return <FaMoneyBillWave className="text-blue-500" />;
      default:
        return null;
    }
  };

  const getOrderStatusIcon = (orderStatus) => {
    switch (orderStatus) {
      case "BOOKING":
        return <FaCheckCircle className="text-purple-500" />;
      case "SHIPPING":
        return <FaTruck className="text-yellow-500" />;
      case "DELIVERED":
        return <FaCheckCircle className="text-green-500" />;
      case "CANCELED":
        return <MdCancel className="h-5 w-5 text-red-500" />;
      default:
        return <FaHourglassHalf className="text-gray-500" />;
    }
  };

  const toggleContent = (orderId) => {
    // Switch the open/closed status of each order's content
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null); // Close if open
    } else {
      setExpandedOrderId(orderId); // Open the current tab
    }
  };

  return (
    <div className="max-w-8xl mx-auto bg-gradient-to-br from-blue-100 to-purple-100 p-6">
      <div className="mx-auto max-w-2xl space-y-5 rounded-lg bg-white p-4 shadow-md">
        <h1 className="mb-2 text-center text-2xl font-bold text-indigo-800">
          Order Management
        </h1>

        <div className="flex flex-col items-center justify-between space-y-2 md:flex-row md:space-x-2 md:space-y-0">
          {/* Search */}
          <div className="w-40 md:w-1/5">
            {" "}
            {/* Keep this width smaller */}
            <Input
              placeholder="Search by ID"
              prefix={<FaSearch className="text-gray-400" />}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-1 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Find price range */}
          <div className="flex-grow md:mr-2 md:w-3/5">
            {" "}
            {/* Use flex-grow to allow Slider to expand */}
            <Slider
              range
              min={0}
              max={100000000}
              value={priceRange}
              onChange={handlePriceRangeChange}
              className="w-full" // Ensure this is full width
              style={{ height: "4px" }}
            />
            <div className="mt-1 text-xs text-gray-600">
              Price Range: {formatPrice(priceRange[0])} -{" "}
              {formatPrice(priceRange[1])}
            </div>
          </div>

          {/* Select bar order Status */}
          <div
            ref={dropdownRef}
            className="relative w-44" // Select occupies 1/4 width
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
                      <span className="text-sm font-medium">
                        {option.value}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Tag list */}
        {totalElements === 0 ? (
          <div className="mt-4 text-center text-sm text-gray-500">
            No orders found matching your criteria.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="hover:scale-102 block rounded-md bg-gray-100 p-3 shadow-md transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 hover:shadow-xl"
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
                          Cus_Name: {order.eachUserResponse.fullname}
                        </p>
                        <p className="mt-1 text-sm text-gray-800">
                          Cus_Phone: {order.eachUserResponse.phone}
                        </p>
                      </>
                    )}
                    <p className="mt-1 text-sm text-gray-800">
                      From: {order.originLocation}
                    </p>
                    <p className="mt-1 text-sm text-gray-800">
                      To: {order.destinationLocation}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {getPaymentMethodIcon(order.paymentMethod)}
                      <span className="text-xs font-bold text-gray-700">
                        {order.paymentMethod}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {editingOrderId === order.id ? (
                        <Select
                          defaultValue={order.orderStatus}
                          onChange={handleOrderStatusChange}
                          className="w-32"
                        >
                          <Option value="SHIPPING">SHIPPING</Option>
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

                    {/* Render edit button conditionally based on order status */}
                    {order.orderStatus !== "SHIPPING" &&
                      order.orderStatus !== "DELIVERED" &&
                      order.orderStatus !== "CANCELED" && (
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
                      )}
                  </div>
                </div>
                <div className="mt-0.5 flex items-center justify-between">
                  <p className="mt-1 text-sm text-gray-800">
                    Total Price: {formatPrice(order.totalPrice)}
                  </p>
                  {order.orderStatus === "SHIPPING" && (
                    <Link
                      to={`/deliveryStaff/orderProgress/${order.id}`}
                      className="flex items-center space-x-1 rounded-md bg-blue-500 px-2 py-1 text-xs text-white transition-colors duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      onClick={(e) => e.stopPropagation()} // Ensure this is a single function
                    >
                      <span>Progress</span>
                      <FaChevronRight />
                    </Link>
                  )}
                </div>
                {/* Toggle content for each order */}
                {expandedOrderId === order.id && (
                  <div className="mt-4 text-center text-lg text-gray-700">
                    <Link
                      to={`/deliveryStaff/orderDetails_Deli/${order.id}`}
                      className="text-blue-400 transition-transform duration-300 hover:scale-105 hover:text-blue-600 hover:underline"
                    >
                      View Order Detail
                    </Link>
                  </div>
                )}
                {/* Icon toggle */}
                <div className="mt-2 flex justify-center">
                  {expandedOrderId === order.id ? (
                    <FaChevronUp
                      className="cursor-pointer text-gray-500"
                      onClick={() => toggleContent(order.id)}
                    />
                  ) : (
                    <FaChevronDown
                      className="cursor-pointer text-gray-500"
                      onClick={() => toggleContent(order.id)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paging */}
        <div className="flex justify-center">
          <Pagination
            current={currentPage}
            pageSize={ordersPerPage}
            total={totalElements}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            className="mt-4 text-center"
          />
        </div>
      </div>
    </div>
  );
};

export default OrderList;
