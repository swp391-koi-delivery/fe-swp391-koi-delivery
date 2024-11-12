import React, { useState, useEffect } from "react";
import {
  FaChartLine,
  FaDollarSign,
  FaCalendarAlt,
  FaUsers,
  FaShoppingCart,
  FaStar,
  FaMoneyBill,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MdErrorOutline } from "react-icons/md";
import axios from "axios";
import api from "../../../config/axios";
import { Rate } from "antd";
import ManageTransaction from "../manage-transaction";
const ManageStatistic = () => {
  const [orderData, setOrderData] = useState([]);
  const [user, setUser] = useState([]);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [showRevenueSummary, setShowRevenueSummary] = useState(false);
  const [showDateInsights, setShowDateInsights] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState(0);
  const [previousMonthRevenue, setPreviousMonthRevenue] = useState(0);
  const [filterType, setFilterType] = useState("detail"); // Loại filter: "day", "month", "year"


  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleStatClick = (statType) => {
    let content = {};
    switch (statType) {
      case "sales":
        content = {
          title: "Total Sales",
          value: `${formatPrice(user.totalRevenue)}`,
          description: "Revenue generated from all sales this month.",
        };
        break;
      case "customers":
        content = {
          title: "Total Customers",
          value: user.customersCount.toLocaleString(),
          description:
            "Number of unique customers who made a purchase this month.",
        };
        break;
      case "orders":
        content = {
          title: "Total Orders",
          value: user.orders.toLocaleString(),
          description: "Number of orders processed this month.",
        };
        break;
      default:
        break;
    }
    setModalContent(content);
    setShowModal(true);
  };
  const Modal = ({ content, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-2xl font-bold">{content.title}</h2>
        <p className="mb-4 text-4xl font-bold text-blue-600">{content.value}</p>
        <p className="mb-6 text-gray-600">{content.description}</p>
        <button
          onClick={onClose}
          className="rounded bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
  const StatItem = ({ icon, value, label, onClick }) => (
    <div
      className="flex cursor-pointer flex-col items-center rounded-lg p-4 transition duration-300 hover:bg-gray-100"
      onClick={onClick}
    >
      {icon}
      <span className="mt-2 text-2xl font-bold">{value}</span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await api.get(
          `manager/dashboard/orderStatistics?filter=${filterType}`,
        );
        const response2 = await api.get("manager/dashboard/dashboardStats");
        setOrderData(response1.data);
        setUser(response2.data);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };
    fetchData();
  }, []);
  

  const processChartDataDate = () => {
    if (filterType === "detail") {
      // Return data as-is to display each order separately.
      return orderData.map((order) => ({
        date: order.date,
        totalPrice: order.totalPrice,
        id: order.id,
      }));
    } else if (filterType === "synthetic") {
      // Group by date and sum the totalPrice for each date.
      const groupedData = orderData.reduce((acc, order) => {
        const date = order.date;
        if (!acc[date]) {
          acc[date] = { date, totalPrice: 0 };
        }
        acc[date].totalPrice += order.totalPrice;
        return acc;
      }, {});

      return Object.values(groupedData);
    } else if (filterType === "month") {
      // Group by month and sum the totalPrice for each month.
      const groupedData = orderData.reduce((acc, order) => {
        const [day, month, year] = order.date.split("/");
        const monthKey = `${month}/${year}`;
        if (!acc[monthKey]) {
          acc[monthKey] = { month: parseInt(month, 10), totalPrice: 0 };
        }
        acc[monthKey].totalPrice += order.totalPrice;
        return acc;
      }, {});

      return Object.values(groupedData);
    } else if (filterType === "year") {
      // Group by year and sum the totalPrice for each year.
      const groupedData = orderData.reduce((acc, order) => {
        const [day, month, year] = order.date.split("/");
        if (!acc[year]) {
          acc[year] = { year: parseInt(year, 10), totalPrice: 0 };
        }
        acc[year].totalPrice += order.totalPrice;
        return acc;
      }, {});

      return Object.values(groupedData);
    }
    return [];
  };


  const convertToDate = (dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split("/");
    return new Date(`${year}-${month}-${day}`);
  };

  const formatDate = (date) => {
    //if (!date) return ""; // Trả về chuỗi rỗng nếu date không hợp lệ
    const yyyy = date?.getFullYear();
    const mm = String(date?.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const dd = String(date?.getDate()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy}`;
  };

  const OrderStatsCard = () => {
    const xAxisKey =
      filterType === "month"
        ? "month"
        : filterType === "year"
          ? "year"
          : "date";
    return (
      <div className="flex h-full flex-col rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 flex items-center text-2xl font-bold">
          <FaChartLine className="mr-2 text-blue-500" /> Order Statistics
        </h2>

        <div className="mb-4">
          <label htmlFor="filterType" className="mr-2">
            Filter by:
          </label>
          <select
            id="filterType"
            value={filterType}
            onChange={handleFilterChange}
            className="rounded border p-2"
          >
            <option value="detail">Detail</option>
            <option value="synthetic">Synthetic</option>
            {/* <option value="month">Month</option> */}
            <option value="year">Year</option>
          </select>
        </div>
        <div className="flex-grow">
          <ResponsiveContainer width="100%" height={450}>
            <LineChart data={processChartDataDate()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="totalPrice"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Order trends based on total price over time.
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="mr-2 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            Total Orders: {user.countOrderDelivered}
          </span>
          <button
            onClick={() => setShowOrderSummary(!showOrderSummary)}
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Summary
          </button>
        </div>
        {showOrderSummary && (
          <div className="mt-4 rounded-lg bg-blue-50 p-4">
            <h3 className="mb-2 font-bold">Order Summary</h3>
            <p>Total number of orders processed with varying price points.</p>
          </div>
        )}
      </div>
    );
  };

  const RevenueDetailsCard = () => (
    <div className="flex h-full flex-col rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 flex items-center text-2xl font-bold">
        <FaMoneyBill className="mr-2 text-green-500" /> Revenue Details
      </h2>
      <div className="flex-grow space-y-4">
        <div className="flex items-center justify-between">
          <span>Total Revenue:</span>
          <span className="font-bold">{formatPrice(user.totalRevenue)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Average Order Value:</span>
          <span className="font-bold">
            {formatPrice(user.averageOrderValue)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Highest Order Value:</span>
          <span className="font-bold">
            {formatPrice(user.highestOrderValue)}
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="mr-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
          Revenue Growth:
          <span className="font-bold">
            {user.revenueGrowth || "Calculating..."}%
          </span>
          {/* Calculate */}
        </span>
        <button
          onClick={() => setShowRevenueSummary(!showRevenueSummary)}
          className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
        >
          Summary
        </button>
      </div>
      {showRevenueSummary && (
        <div className="mt-4 rounded-lg bg-green-50 p-4">
          <h3 className="mb-2 font-bold">Revenue Summary</h3>
          <p>Overview of total revenue and average order value.</p>
        </div>
      )}
    </div>
  );

  const OrderDateInsightsCard = () => (
    <div className="flex h-full flex-col rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 flex items-center text-2xl font-bold">
        <FaCalendarAlt className="mr-2 text-red-500" /> Order Date Insights
      </h2>
      <div className="flex-grow space-y-4">
        <div className="flex items-center justify-between">
          <span>First Order Date:</span>
          <span className="font-bold">
            {formatDate(new Date(convertToDate(user.firstOrderDate)))}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Most Active Date:</span>
          <span className="font-bold">
            {formatDate(new Date(convertToDate(user.mostActiveDay)))}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Order(s):</span>
          <span className="font-bold">{user.mostActiveDayOrderCount}</span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="mr-2 rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
          Date Range: Calculate
        </span>
        <button
          onClick={() => setShowDateInsights(!showDateInsights)}
          className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
        >
          Insights
        </button>
      </div>
      {showDateInsights && (
        <div className="mt-4 rounded-lg bg-red-50 p-4">
          <h3 className="mb-2 font-bold">Date Insights</h3>
          <p>Analysis of order patterns based on dates.</p>
        </div>
      )}
    </div>
  );

  const OrderRatingCard = () => (
    <div className="flex h-full flex-col rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 flex items-center text-2xl font-bold">
        <FaStar className="mr-2 text-yellow-300" />
        Order Rating
      </h2>
      <div className="flex-grow space-y-4">
        <div className="flex items-center justify-between">
          <span>First Order Date:</span>
          <span className="font-bold">
            <Rate disabled defaultValue={user.averageRatingScore} />
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Now: </span>
          <span className="font-bold">{formatDate(new Date())}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="mr-2 rounded bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
          Date Range: Calculate
        </span>
        <button
          onClick={() => setShowDateInsights(!showDateInsights)}
          className="rounded bg-yellow-500 px-4 py-2 font-bold text-white hover:bg-yellow-700"
        >
          Insights
        </button>
      </div>
      {showDateInsights && (
        <div className="mt-4 rounded-lg bg-red-50 p-4">
          <h3 className="mb-2 font-bold">Date Insights</h3>
          <p>Analysis of order patterns based on dates.</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-8">
        <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <StatItem
              icon={
                <FaMoneyBill
                  className="text-4xl text-green-500"
                  aria-hidden="true"
                />
              }
              value={`${formatPrice(user.totalRevenue)}`}
              label="Total Sales"
              onClick={() => handleStatClick("sales")}
            />
            <StatItem
              icon={
                <FaUsers
                  className="text-4xl text-blue-500"
                  aria-hidden="true"
                />
              }
              value={user.customersCount}
              label="Customers"
              onClick={() => handleStatClick("customers")}
            />
            <StatItem
              icon={
                <FaShoppingCart
                  className="text-4xl text-purple-500"
                  aria-hidden="true"
                />
              }
              value={user.orders}
              label="Orders"
              onClick={() => handleStatClick("orders")}
            />
          </div>
          {showModal && (
            <Modal content={modalContent} onClose={() => setShowModal(false)} />
          )}
        </div>
        <div className="container mx-auto p-6">
          <h1 className="mb-8 text-3xl font-bold">
            Order Statistics Dashboard
          </h1>
          <div className="flex flex-col space-y-8">
            {" "}
            {/* Changed space-y-6 to space-y-8 for more vertical spacing */}
            <OrderStatsCard className="h-1000" />{" "}
            {/* Adjust the height here as needed */}
          </div>
          <div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            style={{ marginTop: "20px" }}
          >
            <RevenueDetailsCard />
            <OrderDateInsightsCard />
            <OrderRatingCard />
          </div>
        </div>
        <div className="container mx-auto p-6">
          <ManageTransaction />
        </div>
      </div>
    </>
  );
};

export default ManageStatistic;
