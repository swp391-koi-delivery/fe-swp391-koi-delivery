import React, { useState, useEffect } from "react";
import {
  FaBox,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaDollarSign,
  FaCreditCard,
  FaTruck,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Progress, Steps, Button, Alert } from "antd";
import axios from "axios";
import "./OrderTracking.css";

const { Step } = Steps;

const OrderTracking = () => {
  const [order, setOrder] = useState({
    orderId: "ORD123456",
    orderDate: "2023-06-15",
    originLocation: "New York, NY",
    destinationLocation: "Los Angeles, CA",
    total: 299.99,
    payment: "Credit Card",
    transportMethod: "Express Shipping",
    paymentStatus: "Confirmed",
    status: "In Transit",
    packageStatus: "Out for Delivery",
  });

  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  const stages = [
    { name: "Origin", icon: <FaMapMarkerAlt /> },
    { name: "Warehouse", icon: <FaBox /> },
    { name: "In Transit", icon: <FaTruck /> },
    { name: "Destination", icon: <FaMapMarkerAlt /> },
  ];

  const api = "https://66f564539aa4891f2a25104b.mockapi.io/Order";

  const fetchOrders = async () => {
    try {
      const response = await axios.get(api);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 1;
        if (newProgress >= 100) {
          clearInterval(interval);
          setOrder((prevOrder) => ({
            ...prevOrder,
            status: "Delivered",
            packageStatus: "Delivered",
          }));
          return 100;
        }
        if (newProgress % 25 === 0) {
          setStage((prevStage) => Math.min(prevStage + 1, stages.length - 1));
        }
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const renderField = (icon, label, value) => (
    <div className="field-item d-flex align-items-center mb-4" aria-label={label}>
      <div className="icon mr-2">{icon}</div>
      <div>
        <p className="field-label mb-0">{label}</p>
        <p className="font-weight-bold">{value}</p>
      </div>
    </div>
  );

  const columns = [
    { title: "Order ID", dataIndex: "OrderId", key: "OrderId" },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
    },
    {
      title: "Origin Location",
      dataIndex: "originLocation",
      key: "originLocation",
    },
    {
      title: "Destination Location",
      dataIndex: "destinationLocation",
      key: "destinationLocation",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Payment",
      dataIndex: "payment",
      key: "payment",
    },
    {
      title: "Order Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
    },
    {
      title: "Transport Method",
      dataIndex: "transportMethod",
      key: "transportMethod",
    },
  ];

  return (
    <div className="order-details-container">
      <h2 className="mb-4 text-2xl font-bold">Order Tracking</h2>
      <div className="row mb-4">
        <div className="col-md-6">
          {renderField(<FaBox />, "Order ID", order.orderId)}
          {renderField(<FaCalendarAlt />, "Order Date", order.orderDate)}
          {renderField(<FaMapMarkerAlt />, "Origin", order.originLocation)}
          {renderField(
            <FaMapMarkerAlt />,
            "Destination",
            order.destinationLocation
          )}
          {renderField(<FaDollarSign />, "Total", `$${order.total.toFixed(2)}`)}
        </div>

        <div className="col-md-6">
          {renderField(<FaCreditCard />, "Payment Method", order.payment)}
          {renderField(<FaTruck />, "Transport Method", order.transportMethod)}
          {renderField(
            <FaCheckCircle />,
            "Payment Status",
            order.paymentStatus
          )}
          {renderField(<FaMapMarkerAlt />, "Status", order.status)}
          {renderField(<FaBox />, "Package Status", order.packageStatus)}
        </div>
      </div>

      <h3 className="mb-4 text-xl font-semibold">Delivery Progress</h3>
      <div className="custom-steps">
        <Steps current={stage} className="mb-4">
          {stages.map((s, index) => (
            <Step key={index} title={s.name} icon={s.icon} />
          ))}
        </Steps>
      </div>

      <Progress
        percent={progress}
        status={progress === 100 ? "success" : "active"}
      />

      <div className="d-flex justify-content-between mb-3">
        <Button
          type="primary"
          onClick={() => alert("Tracking information updated")}
        >
          Update Tracking
        </Button>
        <Button type="danger" onClick={() => alert("Support ticket created")}>
          Report Issue
        </Button>
      </div>

      {order.status !== "Delivered" && (
        <Alert
          message="Attention"
          description="Your package is still in transit. We'll notify you of any updates."
          type="warning"
          icon={<FaExclamationTriangle />}
          className="mb-4"
        />
      )}
    </div>
  );
};

export default OrderTracking;
