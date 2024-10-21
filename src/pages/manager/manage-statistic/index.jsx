import React, { useState, useEffect } from "react";
import { FaChartLine, FaDollarSign, FaCalendarAlt, FaUsers, FaShoppingCart } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MdErrorOutline } from "react-icons/md";
import axios from "axios";
import api from "../../../config/axios";
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
  const stats = {
    totalSales: 150000,
    customers: 1200,
    orders: 3500
  };
  const activeCustomers = user.filter(user => user.role === "CUSTOMER" && user.deleted === false);

// Đếm số lượng khách hàng
  const customerCount = activeCustomers.length;
  const calculateTotalOrders = () => {
    return orderData.length;
  };

  //PAID
  // const calculateTotalOrders = () => {
  //   return orderData.filter(order => order.orderStatus === "PAID").length;
  // };

  const handleStatClick = (statType) => {
    let content = {};
    switch (statType) {
      case "sales":
        content = { title: "Total Sales", value: `$${calculateTotalRevenue()}`, description: "Revenue generated from all sales this month." };
        break;
      case "customers":
        content = { title: "Total Customers", value: customerCount.toLocaleString(), description: "Number of unique customers who made a purchase this month." };
        break;
      case "orders":
        content = { title: "Total Orders", value: calculateTotalOrders().toLocaleString(), description: "Number of orders processed this month." };
        break;
      default:
        break;
    }
    setModalContent(content);
    setShowModal(true);
  };
  const Modal = ({ content, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
        <p className="text-4xl font-bold text-blue-600 mb-4">{content.value}</p>
        <p className="text-gray-600 mb-6">{content.description}</p>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
  const StatItem = ({ icon, value, label, onClick }) => (
    <div
      className="flex flex-col items-center p-4 cursor-pointer transition duration-300 hover:bg-gray-100 rounded-lg"
      onClick={onClick}
    >
      {icon}
      <span className="text-2xl font-bold mt-2">{value}</span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
  if (!stats.totalSales && !stats.customers && !stats.orders) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> Unable to load stats. Please try again later.</span>
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
          <MdErrorOutline className="h-6 w-6 text-red-500" />
        </span>
      </div>
    );
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        //const response = await axios.get("http://14.225.220.122:8080/api/order");
        const response1 = await api.get("order/allOrder?page=1&size=1000000000");
        const response2 = await api.get("manager/allUser?page=1&size=1000000000");
        setOrderData(response1.data);
        setUser(response2.data);
        calculateMonthlyRevenue();
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };
    fetchData();
  }, []);

  const calculateMonthlyRevenue = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // Get the current month (0-11)
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Handle December to January transition
    const currentYear = currentDate.getFullYear();
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthOrders = orderData.filter(order => {
      const orderDate = new Date(order.orderDate);
      return (
        orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear && order.orderStatus === "PAID"
      );
    });

    const previousMonthOrders = orderData.filter(order => {
      const orderDate = new Date(order.orderDate);
      return (
        orderDate.getMonth() === previousMonth && orderDate.getFullYear() === previousYear && order.orderStatus === "PAID"
      );
    });

    const currentMonthTotalRevenue = currentMonthOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const previousMonthTotalRevenue = previousMonthOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    setCurrentMonthRevenue(currentMonthTotalRevenue);
    setPreviousMonthRevenue(previousMonthTotalRevenue);
  };

  // Calculate revenue growth percentage
  const calculateRevenueGrowth = () => {
    if (previousMonthRevenue === 0) return "N/A"; // Avoid division by zero
    const growth = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
    return growth.toFixed(2);
  };

  const processChartData = () => {
    const chartData = orderData.map(order => ({
      orderDate: order.orderDate,
      totalPrice: order.totalPrice
    }));
    return chartData.sort((a, b) => a.orderDate - b.orderDate);
  };

  //PAID
  // const processChartData = () => {
  //   const paidOrders = orderData.filter(order => order.orderStatus === "PAID");
  //   const chartData = paidOrders.map(order => ({
  //     orderDate: order.orderDate,
  //     totalPrice: order.totalPrice,
  //   }));
  //   return chartData.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
  // };
  const calculateTotalRevenue = () => {
    return orderData.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2);
  };

  //PAID
  // const calculateTotalRevenue = () => {
  //   const paidOrders = orderData.filter(order => order.orderStatus === "PAID");
  //   return paidOrders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2);
  // };

  const calculateAverageOrderValue = () => {
    return (calculateTotalRevenue() / orderData.length).toFixed(2);
  };

  //PAID
  // const calculateAverageOrderValue = () => {
  //   const totalOrders = calculateTotalOrders();
  //   if (totalOrders === 0) return "0.00";
  //   return (calculateTotalRevenue() / totalOrders).toFixed(2);
  // };

  const OrderStatsCard = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <FaChartLine className="mr-2 text-blue-500" /> Order Statistics
      </h2>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={processChartData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="orderDate" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="totalPrice" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-4 text-sm text-gray-600">
        Order trends based on total price over time.
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
          Total Orders: {orderData.length}
        </span>
        <button
          onClick={() => setShowOrderSummary(!showOrderSummary)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Summary
        </button>
      </div>
      {showOrderSummary && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-bold mb-2">Order Summary</h3>
          <p>Total number of orders processed with varying price points.</p>
        </div>
      )}
    </div>
  );

  const RevenueDetailsCard = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <FaDollarSign className="mr-2 text-green-500" /> Revenue Details
      </h2>
      <div className="flex-grow space-y-4">
        <div className="flex justify-between items-center">
          <span>Total Revenue:</span>
          <span className="font-bold">${calculateTotalRevenue()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Average Order Value:</span>
          <span className="font-bold">${calculateAverageOrderValue()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Highest Order Value:</span>
          <span className="font-bold">
            ${Math.max(...orderData.map(order => order.totalPrice)).toFixed(2)}
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
          Revenue Growth:{/*<span className="font-bold">{calculateRevenueGrowth()}%</span>*/}Calculate
        </span>
        <button
          onClick={() => setShowRevenueSummary(!showRevenueSummary)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Summary
        </button>
      </div>
      {showRevenueSummary && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <h3 className="font-bold mb-2">Revenue Summary</h3>
          <p>Overview of total revenue and average order value.</p>
        </div>
      )}
    </div>
  );

  const OrderDateInsightsCard = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <FaCalendarAlt className="mr-2 text-red-500" /> Order Date Insights
      </h2>
      <div className="flex-grow space-y-4">
        <div className="flex justify-between items-center">
          <span>First Order Date:</span>
          <span className="font-bold">
            {new Date(Math.min(...orderData.map(order => new Date(order.orderDate)))).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Last Order Date:</span>
          <span className="font-bold">
            {new Date(Math.max(...orderData.map(order => new Date(order.orderDate)))).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Most Active Day:</span>
          <span className="font-bold">Calculate</span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
          Date Range: Calculate
        </span>
        <button
          onClick={() => setShowDateInsights(!showDateInsights)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Insights
        </button>
      </div>
      {showDateInsights && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg">
          <h3 className="font-bold mb-2">Date Insights</h3>
          <p>Analysis of order patterns based on dates.</p>
        </div>
      )}
    </div>
  );

  return (
    <>
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
     <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
      {/*</div>h2 className="text-2xl font-bold text-center mb-6">Monthly Statistics</h2> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatItem
          icon={<FaDollarSign className="text-4xl text-green-500" aria-hidden="true" />}
          value={`$${calculateTotalRevenue()}`}
          label="Total Sales"
          onClick={() => handleStatClick("sales")}
        />
        <StatItem
          icon={<FaUsers className="text-4xl text-blue-500" aria-hidden="true" />}
          value={customerCount.toLocaleString()}
          label="Customers"
          onClick={() => handleStatClick("customers")}
        />
        <StatItem
          icon={<FaShoppingCart className="text-4xl text-purple-500" aria-hidden="true" />}
          value={calculateTotalOrders().toLocaleString()}
          label="Orders"
          onClick={() => handleStatClick("orders")}
        />
      </div>
      {showModal && (
        <Modal content={modalContent} onClose={() => setShowModal(false)} />
      )}
    </div>
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Order Statistics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <OrderStatsCard />
        <RevenueDetailsCard />
        <OrderDateInsightsCard />
      </div>
    </div>
    </div>
    </>
  );
};

export default ManageStatistic;
