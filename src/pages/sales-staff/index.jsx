import React, { useState, useEffect } from "react";
//import axios from "axios";
import { FaSearch, FaSort, FaFilter } from "react-icons/fa";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import api from "../../config/axios";
import { Button, Form, Input, InputNumber, Modal, Select, DatePicker } from "antd";
import { toast } from "react-toastify";
import { PlusOutlined } from "@ant-design/icons";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm(); //Sử dụng Ant Design form
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [filterConfig, setFilterConfig] = useState({
    orderStatus: "",
    paymentStatus: "",
    dateRange: { start: "", end: "" },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterAndSortOrders();
  }, [orders, searchTerm, sortConfig, filterConfig]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  };

  const filterAndSortOrders = () => {
    let result = [...orders];

    if (filterConfig.orderStatus) {
      result = result.filter(
        (order) => order.orderStatus === filterConfig.orderStatus,
      );
    }
    if (filterConfig.paymentStatus) {
      result = result.filter(
        (order) => order.paymentStatus === filterConfig.paymentStatus,
      );
    }
    if (filterConfig.dateRange.start && filterConfig.dateRange.end) {
      result = result.filter(
        (order) =>
          new Date(order.orderDate) >= new Date(filterConfig.dateRange.start) &&
          new Date(order.orderDate) <= new Date(filterConfig.dateRange.end),
      );
    }

    if (searchTerm) {
      result = result.filter(
        (order) =>
          order.orderId.toString().includes(searchTerm) ||
          order.describeOrder.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredOrders(result);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleFilter = (filterType, value) => {
    setFilterConfig({ ...filterConfig, [filterType]: value });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      if (values.id) {
        const response = await api.put(`orders/${values.id}`, values);
      } else {
        const response = await api.post("orders", values);
      }
      toast.success("Submit successfully");
      form.resetFields();
      setOpenModal(false);
      fetchOrders();
    } catch (error) {
      toast.error(error.response.data);
    } finally {
      setSubmitting(false);
    }
  };
  //xóa
  const handleDelete = async (id) => {
    try {
      //await axios.delete(`${api}/${userId}`);
      await api.delete(`orders/${id}`);
      toast.success("Deleted successfully");
      fetchOrders();
    } catch (error) {
      toast.error("Fail to Delete!");
    }
  };
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto bg-gray-50 px-4 py-8">
      <h1 className="mb-8 text-center text-4xl font-bold text-indigo-700">
        Order List
      </h1>
      <div className="mb-6 flex flex-wrap items-center justify-between rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 w-full md:mb-0 md:w-1/3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={searchTerm}
              onChange={handleSearch}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        <div className="flex w-full flex-wrap justify-end md:w-2/3">
          <select
            className="mb-2 mr-2 rounded-lg border border-gray-300 p-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400 md:mb-0"
            onChange={(e) => handleFilter("orderStatus", e.target.value)}
            value={filterConfig.orderStatus}
          >
            <option value="">All Order Statuses</option>
            <option value="PendingConfirmation">Pending Confirmation</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
          <select
            className="mb-2 mr-2 rounded-lg border border-gray-300 p-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400 md:mb-0"
            onChange={(e) => handleFilter("paymentStatus", e.target.value)}
            value={filterConfig.paymentStatus}
          >
            <option value="">All Payment Statuses</option>
            <option value="PAYMENTWAITING">Payment Waiting</option>
            <option value="PAID">Paid</option>
          </select>
          <input
            type="date"
            className="mb-2 mr-2 rounded-lg border border-gray-300 p-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400 md:mb-0"
            onChange={(e) =>
              handleFilter("dateRange", {
                ...filterConfig.dateRange,
                start: e.target.value,
              })
            }
            value={filterConfig.dateRange.start}
          />
          <input
            type="date"
            className="rounded-lg border border-gray-300 p-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onChange={(e) =>
              handleFilter("dateRange", {
                ...filterConfig.dateRange,
                end: e.target.value,
              })
            }
            value={filterConfig.dateRange.end}
          />
        </div>
      </div>
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          <Button
            icon={<PlusOutlined />}
            onClick={() => setOpenModal(true)}
            className="mb-4"
            style={{ marginLeft: "20px" }}
          >
            Add
          </Button>
          <div className="overflow-x-auto rounded-lg bg-white shadow-md">
            <table className="w-full">
              <thead className="bg-indigo-100">
                <tr>
                  <th
                    className="cursor-pointer px-4 py-3 transition duration-150 ease-in-out hover:bg-indigo-200"
                    onClick={() => handleSort("orderId")}
                  >
                    Order ID <FaSort className="ml-1 inline" />
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 transition duration-150 ease-in-out hover:bg-indigo-200"
                    onClick={() => handleSort("describeOrder")}
                  >
                    Describe Order <FaSort className="ml-1 inline" />
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 transition duration-150 ease-in-out hover:bg-indigo-200"
                    onClick={() => handleSort("describeOrder")}
                  >
                    Origin Location <FaSort className="ml-1 inline" />
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 transition duration-150 ease-in-out hover:bg-indigo-200"
                    onClick={() => handleSort("describeOrder")}
                  >
                    Destination Location <FaSort className="ml-1 inline" />
                  </th>

                  <th
                    className="cursor-pointer px-4 py-3 transition duration-150 ease-in-out hover:bg-indigo-200"
                    onClick={() => handleSort("orderDate")}
                  >
                    Order Date <FaSort className="ml-1 inline" />
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 transition duration-150 ease-in-out hover:bg-indigo-200"
                    onClick={() => handleSort("totalPrice")}
                  >
                    Total Price <FaSort className="ml-1 inline" />
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 transition duration-150 ease-in-out hover:bg-indigo-200"
                    onClick={() => handleSort("totalPrice")}
                  >
                    Payment <FaSort className="ml-1 inline" />
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 transition duration-150 ease-in-out hover:bg-indigo-200"
                    onClick={() => handleSort("totalPrice")}
                  >
                    Size <FaSort className="ml-1 inline" />
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 transition duration-150 ease-in-out hover:bg-indigo-200"
                    onClick={() => handleSort("totalPrice")}
                  >
                    Quantity <FaSort className="ml-1 inline" />
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 transition duration-150 ease-in-out hover:bg-indigo-200"
                    onClick={() => handleSort("totalPrice")}
                  >
                    Volume <FaSort className="ml-1 inline" />
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 transition duration-150 ease-in-out hover:bg-indigo-200"
                    onClick={() => handleSort("orderStatus")}
                  >
                    Order Status <FaSort className="ml-1 inline" />
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 transition duration-150 ease-in-out hover:bg-indigo-200"
                    onClick={() => handleSort("paymentStatus")}
                  >
                    Payment Status <FaSort className="ml-1 inline" />
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 transition duration-150 ease-in-out hover:bg-indigo-200"
                    onClick={() => handleSort("paymentStatus")}
                  >
                    Action <FaSort className="ml-1 inline" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="transition-colors duration-200 ease-in-out hover:bg-gray-50"
                  >
                    <td className="border-t px-4 py-3">{order.orderId}</td>
                    <td className="border-t px-4 py-3">
                      {order.describeOrder}
                    </td>
                    <td className="border-t px-4 py-3">
                      {order.originLocation}
                    </td>
                    <td className="border-t px-4 py-3">
                      {order.destinationLocation}
                    </td>

                    <td className="border-t px-4 py-3">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="border-t px-4 py-3">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="border-t px-4 py-3">{order.payment}</td>
                    <td className="border-t px-4 py-3">{order.size}</td>
                    <td className="border-t px-4 py-3">${order.quantity}</td>
                    <td className="border-t px-4 py-3">${order.volume}</td>
                    <td className="border-t px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          {
                            Delivered: "bg-green-200 text-green-800",
                            Shipped: "bg-blue-200 text-blue-800",
                            Confirmed: "bg-yellow-200 text-yellow-800",
                            PendingConfirmation: "bg-gray-200 text-gray-800",
                          }[order.orderStatus] || "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="border-t px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          order.paymentStatus === "PAID"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Modal
            confirmLoading={submitting}
            open={openModal}
            onCancel={() => setOpenModal(false)}
            onOk={() => form.submit()}
            title="Submit User"
          >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item name="orderId" hidden>
                <Input />
              </Form.Item>
              <Form.Item name="userId" label="UserId" rules={[
                {
                  required: true,
                  message: "Please enter userId",
                }
              ]}>
                <InputNumber />
              </Form.Item>
              <Form.Item name="describeOrder" label="Describe Order" rules={[
                {
                  required:true,
                  message: "Please choose describe order",
                }
              ]}>
                <Select>
                  <Select.Option value="WHOLESALEORDER">
                    WHOLESALEORDER
                  </Select.Option>
                  <Select.Option value="RETAILORDER">RETAILORDER</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="orderDate" label="Order Date" rules={[
                {
                  required:true,
                  message:"Please choose date",
                }
              ]}>
                <DatePicker />
              </Form.Item>
              <Form.Item name="originLocation" label="Origin Location" rules={[
                {
                  required:true,
                  message: "Please input origin location",
                }
              ]}>
                <Input />
              </Form.Item>
              <Form.Item
                name="destinationLocation"
                label="Destination Location"
                rules={[
                  {
                    required:true,
                    message:"Please enter destination location",
                  }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="size" label="Size" rules={[
                {
                  required:true,
                  message:"Please enter size",
                },
                {
                  type:"number",
                  min:18,
                  message:"min(18)",
                }
              ]}>
                <InputNumber />
              </Form.Item>
              <Form.Item name="quantity" label="Quantity" rules={[
                {
                  required:true,
                  message: "Please enter quantity",
                },
                {
                  type:"number",
                  min: 1,
                  message:"min(1)",
                }
              ]}>
                <InputNumber />
              </Form.Item>
              <Form.Item name="totalPrice" label="Total Price" rules={[
                {
                  required: true,
                  message:"please enter total price",
                },
                {
                  type:"number",
                  min:0,
                  message:"min(0)",
                }
              ]}>
                <InputNumber />
              </Form.Item>
              <Form.Item name="payment" label="Payment">
                <Input />
              </Form.Item>
              <Form.Item name="paymentStatus*" label="Payment Status*" rules={[
                {
                  required:true,
                  message: "Please choose payment status",
                }
              ]}>
                <Select>
                  <Select.Option value="PAYMENTWAITING">
                  PAYMENTWAITING
                  </Select.Option>
                  <Select.Option value="PAYMENTDONE">PAYMENTDONE</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="vat" label="Vat">
                <InputNumber />
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
      <div className="mt-6 flex items-center justify-between rounded-lg bg-white p-4 shadow-md">
        <div>
          <p className="text-sm text-gray-600">
            Showing {indexOfFirstOrder + 1} to{" "}
            {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
            {filteredOrders.length} orders
          </p>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="mr-2 rounded-md bg-indigo-500 px-4 py-2 text-white transition duration-150 ease-in-out hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MdNavigateBefore />
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastOrder >= filteredOrders.length}
            className="rounded-md bg-indigo-500 px-4 py-2 text-white transition duration-150 ease-in-out hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MdNavigateNext />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
