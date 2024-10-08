import React, { useState, useEffect } from "react";
import { Slider, Input, notification } from "antd"; // Import notification
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaCreditCard,
  FaMoneyBillWave,
  FaPaypal,
  FaChevronRight,
} from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import api from "../../../config/axios"; // Import API config

const DeliveryOrderComponent = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await api.get("orders"); // Gọi API để lấy đơn hàng
      const fetchedOrders = response.data;
      console.log(fetchedOrders);
      setOrders(fetchedOrders); // Cập nhật trạng thái với danh sách đơn hàng
      setFilteredOrders(fetchedOrders); // Cập nhật trạng thái cho đơn hàng đã lọc
      setPriceRange([
        0,
        Math.max(...fetchedOrders.map((order) => order.totalPrice)),
      ]); // Thiết lập khoảng giá tối đa
    } catch (error) {
      console.error("Error fetching orders:", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch orders.",
      });
    }
  };

  useEffect(() => {
    fetchOrders(); // Gọi hàm fetch khi component mount
  }, []);

  useEffect(() => {
    const filtered = orders.filter((order) => {
      const orderId = String(order.orderId);
      return (
        orderId.toLowerCase().includes(searchTerm.toLowerCase()) &&
        order.totalPrice >= priceRange[0] &&
        order.totalPrice <= priceRange[1]
      );
    });
    setFilteredOrders(filtered); // Cập nhật trạng thái với đơn hàng đã lọc
  }, [searchTerm, priceRange, orders]);

  const handleSearch = (value) => {
    setSearchTerm(value); // Cập nhật giá trị tìm kiếm
  };

  const handlePriceRangeChange = (value) => {
    setPriceRange(value); // Cập nhật khoảng giá
  };

  const getPaymentMethodIcon = (method) => {
    if (!method) {
      return null;
    }
    switch (method.toLowerCase()) {
      case "credit card":
        return <FaCreditCard className="text-purple-500" />;
      case "cash":
        return <FaMoneyBillWave className="text-green-500" />;
      case "paypal":
        return <FaPaypal className="text-indigo-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PAYMENTDONE":
        return "text-green-500";
      case "PAYMENTWAITING":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <div className="mx-auto max-w-2xl space-y-5 rounded-lg bg-white p-4 shadow-md">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
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
              max={500}
              value={priceRange}
              onChange={handlePriceRangeChange}
              className="w-full"
              style={{ height: "4px" }} // Adjust the slider height
            />
            <div className="mt-1 text-xs text-gray-600">
              Price Range: ${priceRange[0]} - ${priceRange[1]}{" "}
              {/* Adjust the margin */}
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="mt-4 text-center text-sm text-gray-500">
            No orders found matching your criteria.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="hover:scale-102 rounded-md bg-gray-100 p-3 shadow-md transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 hover:shadow-xl"
              >
                <div className="flex flex-col items-start justify-between space-y-1 md:flex-row md:items-center md:space-y-0">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Order ID: {order.orderId}
                    </h2>
                    <hr className="my-2 border-black" /> 
                    <p className="mt-1 text-sm text-gray-800">
                      Total Price: ${order.totalPrice.toFixed(2)}
                    </p>
                    <p className="mt-1 text-sm text-gray-800">
                      Quantity: {order.quantity}
                    </p>
                    <p className="mt-1 text-sm text-gray-800">
                      Order Date:{" "}
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getPaymentMethodIcon(order.payment)}
                    <span className="text-xs text-gray-700">
                      {order.payment}
                    </span>
                    <div className="flex items-center space-x-1">
                      <MdDeliveryDining
                        className={`text-xl ${
                          order.orderStatus === "Delivered"
                            ? "text-green-500"
                            : "text-blue-500"
                        }`}
                      />
                      <span className="text-xs text-gray-700">
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span
                    className={`text-xs font-medium ${getStatusColor(
                      order.paymentStatus,
                    )}`}
                  >
                    Payment Status: {order.paymentStatus}
                  </span>
                  <button className="flex items-center space-x-1 rounded-md bg-blue-500 px-2 py-1 text-xs text-white transition-colors duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                    <Link
                      to={`/orderDetails/${order.orderId}`}
                      className="flex items-center"
                    >
                      <span>Order Details</span>
                      <FaChevronRight />
                    </Link>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryOrderComponent;
