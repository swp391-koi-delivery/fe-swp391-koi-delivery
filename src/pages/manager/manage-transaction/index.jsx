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
  const [currentPage, setCurrentPage] = useState(1);

  const transactionsPerPage = 3;

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
        ? new Date(b.payments.createPayment) -
            new Date(a.payments.createPayment)
        : new Date(a.payments.createPayment) -
            new Date(b.payments.createPayment);
    });
  };

  const paginatedTransactions = () => {
    const filtered = filterTransactions();
    const startIndex = (currentPage - 1) * transactionsPerPage;
    return filtered.slice(startIndex, startIndex + transactionsPerPage);
  };

  const totalPages = Math.ceil(
    filterTransactions().length / transactionsPerPage,
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageClick(i)}
                    className={`px-2 py-1 ${i === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    {i}
                </button>
            );
        }
    } else {
        // Always show first page, last page, and pages around the current page
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        pageNumbers.push(
            <button
                key={1}
                onClick={() => handlePageClick(1)}
                className={`px-2 py-1 ${currentPage === 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
                1
            </button>
        );

        if (startPage > 2) {
            pageNumbers.push(<span key="start-ellipsis">...</span>);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageClick(i)}
                    className={`px-2 py-1 ${i === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalPages - 1) {
            pageNumbers.push(<span key="end-ellipsis">...</span>);
        }

        pageNumbers.push(
            <button
                key={totalPages}
                onClick={() => handlePageClick(totalPages)}
                className={`px-2 py-1 ${currentPage === totalPages ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
                {totalPages}
            </button>
        );
    }

    return pageNumbers;
};

  const getTransactionIcon = (paymentMethod) => {
    switch (paymentMethod.toLowerCase()) {
      case "bank_transfer":
        return <BiTransfer className="h-6 w-6 text-blue-500" />;
      case "vnpay":
        return <BiMoney className="h-6 w-6 text-green-500" />;
      case "card":
        return <BiReceipt className="h-6 w-6 text-red-500" />;
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // const formatDate = (dateString) => {
  //   return new Date(dateString).toLocaleDateString("en-US", {
  //     year: "numeric",
  //     month: "short",
  //     day: "numeric",
  //   });
  // };

  return (
    <div className="mx-auto w-full rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        Transaction History
      </h2>

      {error && (
        <div
          className="mb-4 flex items-center rounded-lg bg-red-100 p-4"
          role="alert"
        >
          <FiAlertCircle className="mr-2 h-5 w-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {paginatedTransactions().map((transaction) => (
          <div
            key={transaction.id}
            className="rounded-lg border p-4 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={"../assets/images/vodanh.jpg"}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  {getTransactionIcon(transaction.payments.paymentMethod)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {transaction.description}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {transaction.payments.createPayment}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {formatPrice(
                        transaction.payments.orderResponse.totalPrice,
                      )}
                    </span>
                    <span
                      className={`font-semibold ${transaction.transactionStatus === "SUCCESS" ? "text-green-600" : "text-yellow-600"}`}
                    >
                      {transaction.transactionStatus}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {transaction.from?.fullname}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                setExpandedTransaction(
                  expandedTransaction === transaction.id
                    ? null
                    : transaction.id,
                )
              }
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 focus:underline focus:outline-none"
              aria-expanded={expandedTransaction === transaction.id}
              aria-controls={`details-${transaction.id}`}
            >
              {expandedTransaction === transaction.id
                ? "Hide Details"
                : "Show Details"}
            </button>

            {expandedTransaction === transaction.id && (
              <div
                id={`details-${transaction.id}`}
                className="mt-4 rounded-lg bg-gray-50 p-4"
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
        <div className="py-8 text-center text-gray-500">
          No transactions found for the selected filter.
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
        >
          Previous
        </button>
        <div className="mt-6 flex justify-center space-x-2">
                {renderPageNumbers()}
            </div>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageTransaction;
