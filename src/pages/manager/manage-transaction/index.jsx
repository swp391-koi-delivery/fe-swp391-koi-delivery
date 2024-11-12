import React, { useState, useEffect } from "react"; 
import { FiChevronDown, FiChevronUp, FiAlertCircle } from "react-icons/fi";
import { BiTransfer, BiMoney, BiReceipt, BiUser } from "react-icons/bi";
import api from "../../../config/axios";

const ManageTransaction = () => {
    const [transactions, setTransactions] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("desc");
    const [expandedTransaction, setExpandedTransaction] = useState(null);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchTransactions = async () => {
        try {
          const response = await api.get("order/listTransaction");
          setTransactions(response.data); // Assuming the data is an array of transactions.
          console.log(response.data);
        } catch (err) {
          setError("Failed to fetch transactions. Please try again later.");
          console.error(err);
        }
      };
  
      fetchTransactions();
    }, []);
  
    const filterTransactions = () => {
      let filtered = [...transactions];
      if (selectedFilter !== "all") {
        filtered = filtered.filter((t) => t.type === selectedFilter);
      }
      return filtered.sort((a, b) => {
        return sortOrder === "desc"
          ? new Date(b.payments.createPayment) - new Date(a.payments.createPayment)
          : new Date(a.payments.createPayment) - new Date(b.payments.createPayment);
      });
    };
  
    const getTransactionIcon = (paymentMethod) => {
      switch (paymentMethod.toLowerCase()) {
        case "bank_transfer":
          return <BiTransfer className="w-6 h-6 text-blue-500" />;
        case "vnpay":
          return <BiMoney className="w-6 h-6 text-green-500" />;
        case "card":
          return <BiReceipt className="w-6 h-6 text-red-500" />;
        default:
          return null;
      }
    };
  
    const formatAmount = (amount) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    };
  
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };
  
    return (
      <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Transaction History</h2>
  
        {error && (
          <div className="mb-4 p-4 bg-red-100 rounded-lg flex items-center" role="alert">
            <FiAlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
  
        {/* <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter transactions"
          >
            <option value="all">All Transactions</option>
            <option value="deposit">Deposits</option>
            <option value="withdrawal">Withdrawals</option>
            <option value="transfer">Transfers</option>
          </select>
  
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="flex items-center justify-center p-2 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`Sort by date ${sortOrder === "desc" ? "ascending" : "descending"}`}
          >
            Sort by Date
            {sortOrder === "desc" ? <FiChevronDown className="ml-2" /> : <FiChevronUp className="ml-2" />}
          </button>
        </div> */}
  
        <div className="space-y-4">
          {filterTransactions().map((transaction) => (
            <div
              key={transaction.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={"../assets/images/vodanh.jpg"}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {getTransactionIcon(transaction.payments.paymentMethod)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{transaction.description}</h3>
                    <p className="text-sm text-gray-500">{formatDate(transaction.payments.createPayment)}</p>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{formatAmount(transaction.payments.orderResponse.totalPrice)}</span>
                      <p className="text-sm text-gray-500">{transaction.from?.fullname}</p>
                      <span className={`font-semibold ${transaction.transactionStatus === "SUCCESS" ? "text-green-600" : "text-yellow-600"}`}>
                        {transaction.transactionStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
  
              <button
                onClick={() => setExpandedTransaction(expandedTransaction === transaction.id ? null : transaction.id)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
                aria-expanded={expandedTransaction === transaction.id}
                aria-controls={`details-${transaction.id}`}
              >
                {expandedTransaction === transaction.id ? "Hide Details" : "Show Details"}
              </button>
  
              {expandedTransaction === transaction.id && (
                <div
                  id={`details-${transaction.id}`}
                  className="mt-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Phone</p>
                      <p className="font-medium">{transaction.from.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Address</p>
                      <p className="font-medium">{transaction.from.address}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
  
        {filterTransactions().length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No transactions found for the selected filter.
          </div>
        )}
      </div>
    );
};

export default ManageTransaction;
