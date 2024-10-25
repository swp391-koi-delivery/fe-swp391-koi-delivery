import React, { useState, useEffect } from "react";
import { Slider, Input, notification, Pagination, Select } from "antd";
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
  FaEdit,
} from "react-icons/fa";
import api from "../../../config/axios";
import { toast } from "react-toastify";

const { Option } = Select;

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [newOrderStatus, setNewOrderStatus] = useState("");
  const ordersPerPage = 3;

  const fetchOrders = async () => {
    try {
      const response = await api.get("order/listOrderPaid");
      const fetchedOrders = response.data;
      console.log(fetchedOrders)
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
    // Filtering orders based on search term and price range
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const handleEditStatus = async (id) => {
    try {
      await api.put(`delivery/order/${id}`, {
        orderStatus: newOrderStatus,
      });
      toast.success("Update successfully");
      // Fetch the order after successfully updating
      fetchOrders();
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
    if (!method) {
      return null;
    }
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
      case "PAID":
        return <FaCheckCircle className="text-green-500" />;
      case "SHIPPING":
        return <FaTruck className="text-yellow-500" />;
      case "DELIVERED":
        return <FaCheckCircle className="text-green-500" />;
      default:
        return <FaHourglassHalf className="text-gray-500" />;
    }
  };

  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  return (
    <div className="mx-auto max-w-7xl bg-gradient-to-br from-blue-200 to-purple-200 p-6">
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
                          <Option value="DELIVERED">DELIVERED</Option>
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
                    <FaEdit
                      className="cursor-pointer text-gray-500"
                      onClick={() =>
                        editingOrderId === order.id
                          ? handleEditStatus(order.id)
                          : setEditingOrderId(order.id)
                      }
                    />
                  </div>
                </div>
                <div className="mt-0.5 flex items-center justify-between">
                  <p className="mt-1 text-sm text-gray-800">
                    Total Price: {formatPrice(order.totalPrice)}
                  </p>
                  <Link
                    to={`/deliveryStaff/orderDetails_Deli/${order.id}`}
                    className="flex items-center space-x-1 rounded-md bg-blue-500 px-2 py-1 text-xs text-white transition-colors duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    <span>Details</span>
                    <FaChevronRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center">
          <Pagination
            current={currentPage}
            pageSize={ordersPerPage}
            total={filteredOrders.length}
            onChange={(page) => setCurrentPage(page)}
            className="mt-4"
          />
        </div>
      </div>
    </div>
  );
};

export default OrderList;
