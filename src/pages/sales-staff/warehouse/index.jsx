import React from "react";
import CrudTemplate from "../../../components/crud-template/CrudTemplate";
import OrderInWarehouse from "../orderInWarehouse";
import { Button } from "antd";
import { Link } from "react-router-dom";

function WareHouseList() {
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", align: "left" },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      align: "left",
    },
    {
      title: "Max Capacity",
      dataIndex: "maxCapacity",
      key: "maxCapacity",
      align: "left",
    },
    {
      title: "Current Capacity",
      dataIndex: "currentCapacity",
      key: "currentCapacity",
      align: "left",
    },
    {
      title: "Booking Capacity",
      dataIndex: "bookingCapacity",
      key: "bookingCapacity",
      align: "left",
    },
    {
      title: "View",
      key: "orderDetails",
      align: "left",
      render: (record) => (
        <>
          <div className="flex space-x-2">
            <Link
              to={`/dashboard/warehouse/${record.id}`}
              className="flex items-center justify-center rounded-md bg-blue-500 px-2 py-1 text-xs text-white transition-colors duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              style={{ width: "100px" }}
            >
              <span>Warehousing</span>
            </Link>
            <Link
              to={`/dashboard/bookingOrder/${record.id}`}
              className="flex items-center justify-center rounded-md bg-blue-500 px-2 py-1 text-xs text-white transition-colors duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              style={{ width: "100px" }}
            >
              <span>Booking</span>
            </Link>
          </div>
        </>
      ),
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-8">
      <CrudTemplate columns={columns} path="sale/wareHouse/available" />
    </div>
  );
}

export default WareHouseList;
