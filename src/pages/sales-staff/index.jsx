import React, { useState, useEffect } from "react";
import {
  Slider,
  Input,
  notification,
  Pagination,
  Select,
  Modal,
  Button,
  Form,
  InputNumber,
} from "antd";
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
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaWarehouse,
} from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import FeedbackForm from "./feedback";
import api from "../../config/axios";
import Booking from "./booking";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
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
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const ordersPerPage = 3;

  const fetchOrders = async () => {
    try {
      const response = await api.get(
        `order/allOrder?page=${currentPage}&size=${ordersPerPage}`,
      );
      const fetchedOrders = response.data;
      console.log(response.data);
      // console.log(fetchedOrders.totalElements);

      setOrders(response.data.content);
      setFilteredOrders(response.data.content);
      setTotalElement(response.data.totalElements);
      // console.log(filteredOrders.totalElements);
      setPriceRange([
        0,
        // Math.max(...fetchedOrders.map((order) => order.totalPrice)),
        Math.max(
          Array.isArray(filteredOrders) &&
            filteredOrders.map((order) => order.totalPrice),
        ),
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
  }, [currentPage, ordersPerPage]); // Chỉ gọi lại khi currentPage hoặc ordersPerPage thay đổi

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
  }, [searchTerm, priceRange, orders]);

  const handleBookingSubmit = async (warehouseId, orderId) => {
    setSubmitting(true);
    try {
      const response = await api.post(
        `sale/warehouse/bookingSlot?wareHouseId=${warehouseId}&orderId=${orderId}`,
      );
      toast.success("Booking successfully");
      handleModalClose();
      fetchOrders();
    } catch (error) {
      console.error("Error booking slot:", error);
      toast.error("Fail to booking");
    }finally {
      setSubmitting(false);
    }
  };

  const toggleBookingForm = (orderId) => {
    setExpandedBookingId(orderId);
    setIsModalVisible(true); // Mở modal
  };

  const handleModalClose = () => {
    setIsModalVisible(false); // Đóng modal
  };

  const toggleContent = (orderId) => {
    // Toggle trạng thái mở/đóng nội dung của từng order
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null); // Đóng nếu đang mở
    } else {
      setExpandedOrderId(orderId); // Mở thẻ hiện tại
    }
  };
  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
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

  // const formatPriceDollar = (price) => {
  //   return new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: "USD",
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2,
  //   }).format(price);
  // };
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

        <div className="flex flex-col items-center justify-between space-y-2 md:flex-row md:space-x-2 md:space-y-0">
          <div className="w-full md:w-1/2">
            <Input
              placeholder="Search by Order ID"
              prefix={<FaSearch className="text-gray-400" />}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-1 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* <div className="w-full md:w-1/2">
            <Slider
              range
              min={0}
              max={5000000000000}
              value={priceRange}
              onChange={handlePriceRangeChange}
              className="w-full"
              style={{ height: "4px" }}
            />
            <div className="mt-1 text-xs text-gray-600">
              Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </div>
          </div> */}
        </div>

        {totalElements === 0 ? (
          <div className="mt-4 text-center text-sm text-gray-500">
            No orders found matching your criteria.
          </div>
        ) : (
          <div className="space-y-3">
            {Array.isArray(orders) &&
              orders.map((order) => (
                <div
                  key={`${order.id}-${order.orderDate}`}
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
                      {/* <div className="flex items-center space-x-1">
                      {getPaymentMethodIcon(order.paymentMethod)}
                      <span className="text-xs font-bold text-gray-700">
                        {order.paymentMethod}
                      </span>
                    </div> */}
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
                      <FaEdit
                        className="cursor-pointer text-gray-500"
                        onClick={() =>
                          editingOrderId === order.id
                            ? handleEditStatus(order.id)
                            : setEditingOrderId(order.id)
                        }
                      />
                      <FaTrash
                        className="cursor-pointer text-red-500"
                        onClick={() => handleDeleteOrder(order.id)} // Trigger delete
                      />
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
                  {/* Toggle nội dung riêng biệt cho từng order */}
                  {expandedOrderId === order.id && (
                    <div className="mt-4 text-center text-lg text-gray-700">
                      <FeedbackForm id={order.id} />
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
                  <Modal
                    confirmLoading={submitting}
                    title={`Booking for Order ID: ${expandedBookingId}`}
                    visible={isModalVisible}
                    onCancel={handleModalClose}
                    onOk={() => form.submit()} // Gọi submit của Form khi nhấn OK
                  >
                    {/* Form tích hợp trong modal */}
                    <Form
                      form={form}
                      layout="vertical"
                      onFinish={() =>
                        handleBookingSubmit(warehouseId, expandedBookingId)
                      }
                    >
                      {/* Order ID (disabled input) */}
                      <Form.Item>
                        <Input hidden
                          value={expandedBookingId}
                        />
                      </Form.Item>

                      {/* Warehouse ID with number input */}
                      <Form.Item
                        label="Warehouse ID"
                        name="warehouseId"
                        rules={[
                          {
                            required: true,
                            message: "Warehouse ID is required",
                          },
                          {
                            type: "number",
                            min: 0,
                            message: "Warehouse ID cannot be negative",
                          },
                        ]}
                      >
                        <InputNumber
                          value={warehouseId}
                          onChange={(value) => setWarehouseId(value)}
                          placeholder="Enter Warehouse ID"
                          className="w-100"
                          min={0} // Không cho phép số âm
                        />
                      </Form.Item>
                    </Form>
                  </Modal>
                </div>
              ))}
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
