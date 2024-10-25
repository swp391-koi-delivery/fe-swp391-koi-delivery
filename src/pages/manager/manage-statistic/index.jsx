import React, { useState, useEffect } from "react";
import {
  FaChartLine,
  FaDollarSign,
  FaCalendarAlt,
  FaUsers,
  FaShoppingCart,
  FaStar,
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
  const [filterType, setFilterType] = useState("synthetic"); // Loại filter: "day", "month", "year"
  
  const stats = {
    totalSales: 150000,
    customers: 1200,
    orders: 3500,
  };
  // const activeCustomers = user.filter(
  //   (user) => user.role === "CUSTOMER" && user.deleted === false,
  // );

  const activeCustomers = Array.isArray(user)
  ? user.filter((user) => user.role === "CUSTOMER" && user.deleted === false)
  : [];
  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

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
        content = {
          title: "Total Sales",
          value: `$${calculateTotalRevenue()}`,
          description: "Revenue generated from all sales this month.",
        };
        break;
      case "customers":
        content = {
          title: "Total Customers",
          value: customerCount.toLocaleString(),
          description:
            "Number of unique customers who made a purchase this month.",
        };
        break;
      case "orders":
        content = {
          title: "Total Orders",
          value: calculateTotalOrders().toLocaleString(),
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
  if (!stats.totalSales && !stats.customers && !stats.orders) {
    return (
      <div
        className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline">
          {" "}
          Unable to load stats. Please try again later.
        </span>
        <span className="absolute bottom-0 right-0 top-0 px-4 py-3">
          <MdErrorOutline className="h-6 w-6 text-red-500" />
        </span>
      </div>
    );
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        //const response = await axios.get("http://14.225.220.122:8080/api/order");
        const response1 = await api.get(
          "order/allOrder?page=1&size=1000000000",
        );
        const response2 = await api.get(
          "manager/allUser?page=1&size=1000000000",
        );
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

    const currentMonthOrders = orderData.filter((order) => {
      const [day, month, year] = order.orderDate.split("/").map(Number); // Split date string
      const orderDate = new Date(year, month - 1, day); // Create Date object
      return (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear &&
        order.orderStatus === "PAID"
      );
    });

    const previousMonthOrders = orderData.filter((order) => {
      const [day, month, year] = order.orderDate.split("/").map(Number); // Split date string
      const orderDate = new Date(year, month - 1, day); // Create Date object
      return (
        orderDate.getMonth() === previousMonth &&
        orderDate.getFullYear() === previousYear &&
        order.orderStatus === "PAID"
      );
    });

    const currentMonthTotalRevenue = currentMonthOrders.reduce(
      (sum, order) => sum + order.totalPrice,
      0,
    );
    const previousMonthTotalRevenue = previousMonthOrders.reduce(
      (sum, order) => sum + order.totalPrice,
      0,
    );

    setCurrentMonthRevenue(currentMonthTotalRevenue);
    setPreviousMonthRevenue(previousMonthTotalRevenue);
  };

  // Calculate revenue growth percentage
  const calculateRevenueGrowth = () => {
    if (previousMonthRevenue === 0) return "N/A"; // Avoid division by zero
    const growth =
      ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) *
      100;
    return growth.toFixed(2);
  };

  const processChartData = () => {
    const chartData = orderData.map((order) => ({
      orderDate: formatDate(convertToDate(order.orderDate)), // Use convertToDate to parse DD/MM/YYYY format
      totalPrice: order.totalPrice,
    }));
    console.log(chartData.sort(
      (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
    ))
    return chartData.sort(
      (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
    ); // Sort by the parsed date
  };
  // const processChartDataDate = () => {
  //   const combinedData = orderData.map((order) => ({
  //     orderDate: formatDate(convertToDate(order.orderDate)), // Chuyển đổi định dạng ngày
  //     totalPrice: order.totalPrice, // Giá của đơn hàng
  //   }));
  //   //console.log(orderData);
  //   // Tính tổng giá cho mỗi ngày
  //   if (filterType === "detail") {
  //     return processChartData();
  //   }
  //   const aggregatedData = combinedData.reduce((acc, curr) => {
  //     const existing = acc.find((item) => item.orderDate === curr.orderDate);

  //     if (existing) {
  //       existing.totalPrice += curr.totalPrice; // Cộng dồn giá nếu ngày đã tồn tại
  //     } else {
  //       acc.push({ ...curr }); // Nếu ngày chưa tồn tại, thêm vào mảng
  //     }
  //     //console.log(acc);
  //     return acc;
  //   }, []);

  //   return aggregatedData.sort(
  //     (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
  //   ); // Sắp xếp theo orderDate
  // };

  const processChartDataDate = () => {
    const combinedData = orderData.map((order) => ({
      orderDate: formatDate(convertToDate(order.orderDate)), // Chuyển đổi định dạng ngày
      totalPrice: order.totalPrice, // Giá của đơn hàng
    }));
    const aggregatedData = combinedData.reduce((acc, curr) => {
      const date = new Date(curr.orderDate);
      let key;
      if (filterType === "detail") {
        return processChartData();
      } else if (filterType === "month") {
        key = `${date.getFullYear()}-${date.getMonth() + 1}`; // Chuỗi định dạng "YYYY-MM"
      } else if (filterType === "year") {
        key = `${date.getFullYear()}`; // Chỉ năm
      } else {
        key = curr.orderDate; // Theo ngày
      }
  
      const existing = acc.find((item) => item.key === key);
  
      if (existing) {
        existing.totalPrice += curr.totalPrice; // Cộng dồn giá nếu key đã tồn tại
      } else {
        acc.push({ key, totalPrice: curr.totalPrice }); // Nếu chưa tồn tại, thêm vào mảng
      }
      console.log(acc)
      return acc;
    }, []);
  
    return aggregatedData.sort((a, b) => new Date(a.key) - new Date(b.key)); // Sắp xếp theo key
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
    return orderData
      .reduce((sum, order) => sum + order.totalPrice, 0)
      .toFixed(2);
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

  // Helper function to convert DD/MM/YYYY to YYYY-MM-DD

  const getMostActiveDay = () => {
    const dailyTotals = orderData.reduce((acc, order) => {
      const orderDate = formatDate(convertToDate(order.orderDate)); // Chuyển đổi định dạng ngày
      if (!acc[orderDate]) {
        acc[orderDate] = 0; // Khởi tạo nếu chưa có
      }
      acc[orderDate] += order.totalPrice; // Cộng dồn doanh thu
      return acc;
    }, {});
  
    // Tìm ngày có doanh thu cao nhất
    let mostActiveDay = null;
    let highestRevenue = 0;
  
    for (const date in dailyTotals) {
      if (dailyTotals[date] > highestRevenue) {
        highestRevenue = dailyTotals[date];
        mostActiveDay = date;
      }
    }
  
    return { mostActiveDay, highestRevenue };
  };


  const convertToDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return new Date(`${year}-${month}-${day}`);
  };

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const dd = String(date.getDate()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy}`;
  };
  const { mostActiveDay, highestRevenue } = getMostActiveDay();

  const OrderStatsCard = () => (
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
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height={450}>
          <LineChart data={processChartDataDate()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="key"
              tickFormatter={(value) => {
                if (filterType === "month") {
                  // Chỉ hiện tháng và năm (MM/YYYY)
                  return value;
                } else if (filterType === "year") {
                  // Chỉ hiện năm
                  return value;
                }
                return value; // Mặc định hiển thị ngày đầy đủ
              }}
            />
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
          Total Orders: {orderData.length}
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

  const RevenueDetailsCard = () => (
    <div className="flex h-full flex-col rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 flex items-center text-2xl font-bold">
        <FaDollarSign className="mr-2 text-green-500" /> Revenue Details
      </h2>
      <div className="flex-grow space-y-4">
        <div className="flex items-center justify-between">
          <span>Total Revenue:</span>
          <span className="font-bold">${calculateTotalRevenue()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Average Order Value:</span>
          <span className="font-bold">${calculateAverageOrderValue()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Highest Order Value:</span>
          <span className="font-bold">
            $
            {Math.max(...orderData.map((order) => order.totalPrice)).toFixed(2)}
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="mr-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
          Revenue Growth:
          {/* <span className="font-bold">{calculateRevenueGrowth()}%</span> */}
          Calculate
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
            {formatDate(
              new Date(
                Math.min(
                  ...orderData.map((order) => convertToDate(order.orderDate)),
                ),
              ),
            )}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Last Order Date:</span>
          <span className="font-bold">
            {formatDate(
              new Date(
                Math.max(
                  ...orderData.map((order) => convertToDate(order.orderDate)),
                ),
              ),
            )}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Most Active Day:</span>
         <span className="font-bold">{mostActiveDay ? `${mostActiveDay}` : "N/A"}</span>
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
            <Rate disabled defaultValue={4.5} />
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Now: </span>
          <span className="font-bold">
            {formatDate(
              new Date(
                Math.max(
                  ...orderData.map((order) => convertToDate(order.orderDate)),
                ),
              ),
            )}
          </span>
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
          {/*</div>h2 className="text-2xl font-bold text-center mb-6">Monthly Statistics</h2> */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <StatItem
              icon={
                <FaDollarSign
                  className="text-4xl text-green-500"
                  aria-hidden="true"
                />
              }
              value={`$${calculateTotalRevenue()}`}
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
              value={customerCount.toLocaleString()}
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
      </div>
    </>
  );
};

export default ManageStatistic;
