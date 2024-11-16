import { notification, Pagination } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../config/axios";
import {
  FaCheckCircle,
  FaChevronRight,
  FaEdit,
  FaHourglassHalf,
  FaMoneyBillWave,
  FaTimesCircle,
  FaTruck,
  FaWarehouse,
} from "react-icons/fa";
function OrderInWarehouse() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [newOrderStatus, setNewOrderStatus] = useState("");
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null); // Tạo state để lưu ID của order đang được mở
  const [totalBox, setTotalBox] = useState(0);
  const [title, setTitle] = useState(0);
  const { id } = useParams();
  const ordersPerPage = 3;
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get(
          `sale/wareHouseContainOrder?wareHouseId=${id}`,
        );
        const fetchedOrders = response.data.orders;
        const totalElements = response.data?.totalBox || 0;
        const title = response.data?.description || 0;
        console.log("Fetched Orders:", fetchedOrders);
        setOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders);
        setTotalBox(totalElements);
        setTitle(title);
      } catch (error) {
        console.error("Error fetching orders:", error);
        notification.error({
          message: "Error",
          description: "Failed to fetch orders.",
        });
      }
    };

    fetchOrders();
  }, [id]);

  useEffect(() => {
    setFilteredOrders(orders);
    setCurrentPage(1);
  }, [orders, filteredOrders]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleOrderStatusChange = (value) => {
    setNewOrderStatus(value);
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
      case " CANCELED":
        return <FaTimesCircle className="text-red-500" />;
      case "REJECTED":
        return <FaTimesCircle className="text-red-500" />;
      case "AWAITING_RESPONSE":
        return <FaHourglassHalf className="text-yellow-500" />;
      case "AWAITING_PAYMENT":
        return <FaMoneyBillWave className="text-orange-500" />;
      case "PAID":
        return <FaCheckCircle className="text-green-500" />;
      case "SHIPPING":
        return <FaTruck className="text-blue-500" />;
      case "BOOKING":
        return <FaWarehouse className="text-blue-500" />;
      case "DELIVERED":
        return <FaCheckCircle className="text-green-500" />;
      case "ACCEPTED":
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
          {title} : 📦{totalBox} BOX
        </h1>

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
                    {/* {order && (
                      <>
                        <p className="mt-1 text-sm text-gray-800">
                          Customer Name: {order.fullname}
                        </p>
                        <p className="mt-1 text-sm text-gray-800">
                          Customer Phone: {order.phone}
                        </p>
                      </>
                    )} */}
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

                  <div className="flex flex-col items-start space-y-2">
                    <div className="flex items-center space-x-1">
                      {getOrderStatusIcon(order.orderStatus)}
                      <span className="text-sm font-bold text-gray-700">
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-0.5 flex items-center justify-between">
                  <p className="text-sm text-gray-800">
                    Order Date: {order.orderDate}
                  </p>
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
}

export default OrderInWarehouse;
