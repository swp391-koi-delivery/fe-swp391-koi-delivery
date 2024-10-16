import React, { useState, useEffect } from "react";
import { Slider, Input, notification, Pagination } from "antd";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaCreditCard,
  FaMoneyBillWave,
  FaChevronRight,
  FaHourglassHalf,
  FaTimesCircle,
  FaTruck,
  FaCheckCircle,
} from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import api from "../../config/axios";


const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  const fetchOrders = async () => {
    try {
      const response = await api.get("order");
      const fetchedOrders = response.data;
      setOrders(fetchedOrders);
      setFilteredOrders(fetchedOrders);
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
    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter((order) => {
      const orderId = String(order.id);
      return (
        orderId.toLowerCase().includes(searchTerm.toLowerCase()) &&
        order.totalPrice >= priceRange[0] &&
        order.totalPrice <= priceRange[1]
      );
    });
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, priceRange, orders]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
  };

  const getPaymentMethodIcon = (method) => {
    if (!method) {
      return null;
    }
    switch (method.toLowerCase()) {
      case "bank_transfer":
        return <FaCreditCard className="text-purple-500" />;
      case "cash":
        return <FaMoneyBillWave className="text-green-500" />;
      default:
        return <FaQuestionCircle className="text-gray-500" />; // Fallback icon
    }
  };

  const getOrderStatusIcon = (orderStatus) => {
    switch (orderStatus) {
      case "Pending":
        return <FaHourglassHalf className="text-yellow-500" />;
      case "Canceled":
        return <FaTimesCircle className="text-red-500" />;
      case "Rejected":
        return <FaTimesCircle className="text-red-500" />;
      case "Awaiting_response":
        return <FaHourglassHalf className="text-yellow-500" />;
      case "Awaiting_Payment":
        return <FaMoneyBillWave className="text-orange-500" />;
      case "Paid":
        return <FaCheckCircle className="text-green-500" />;
      case "Shipping":
        return <FaTruck className="text-blue-500" />;
      case "Delivered":
        return <FaCheckCircle className="text-green-500" />;
      case "Accepted":
        return <FaCheckCircle className="text-green-500" />; // Assuming "Accepted" has a green checkmark
      default:
        return <FaHourglassHalf className="text-gray-500" />;
    }
  };

  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <div className="mx-auto max-w-2xl space-y-5 rounded-lg bg-white p-4 shadow-md">
        <h1 className="mb-2 text-center text-2xl font-bold text-indigo-800">
          Order Management
        </h1>

        <div className="flex flex-col items-center justify-between space-y-2 md:flex-row md:space-x-2 md:space-y-0">
          <div className="w-full md:w-1/2">
            <Input
              placeholder="Search by Order ID"
              prefix={<FaSearch className="text-gray-400" />}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-1 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full md:w-1/2">
            <Slider
              range
              min={0}
              max={100}
              value={priceRange}
              onChange={handlePriceRangeChange}
              className="w-full"
              style={{ height: "4px" }}
            />
            <div className="mt-1 text-xs text-gray-600">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </div>
          </div>
        </div>

        {paginatedOrders.length === 0 ? (
          <div className="mt-4 text-center text-sm text-gray-500">
            No orders found matching your criteria.
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedOrders.map((order) => (
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
                    <p className="mt-1 text-sm text-gray-800">
                      Price: ${order.totalPrice}
                    </p>
                    <p className="mt-1 text-sm text-gray-800">
                      Quantity: {order.totalQuantity}
                    </p>
                    <p className="mt-1 text-sm text-gray-800">
                      Box: {order.totalBox}
                    </p>
                    <p className="mt-1 text-sm text-gray-800">
                      Volume: {order.totalVolume}
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
                      {getOrderStatusIcon(order.orderStatus)}
                      <span className="text-xs font-bold text-gray-700">
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-0.5 flex items-center justify-between">
                  <p className="text-sm text-gray-800">Order Date: {order.orderDate}</p>
                  <Link
                    to={`/dashboard/orderDetails/${order.id}`}
                    className="flex items-center space-x-1 rounded-md bg-blue-500 px-2 py-1 text-xs text-white transition-colors duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    <span>Order Details</span>
                    <FaChevronRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-8 flex justify-center">
          <Pagination
            current={currentPage}
            total={filteredOrders.length}
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
