import React from "react";
import CRUDTemplate from "../../../components/crud-template";
import { Form, Input, InputNumber } from "antd";
import "./index.css";
function ManageBox() {
  const columns = [
    { title: "ID", dataIndex: "id", key: "id",align: "left", },
    { title: "Type", dataIndex: "type", key: "type",align: "left", },
    { title: "Volume", dataIndex: "volume", key: "volume",align: "left", },
    { title: "Price", dataIndex: "price", key: "price",align: "left", },
  ];

  const formItems = [
    <>
      <Form.Item name="id" hidden>
        <InputNumber />
      </Form.Item>
      <Form.Item
        name="type"
        label="Type"
        rules={[{ required: true, message: "Please input type of Box" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="volume"
        label="Volume"
        rules={[
          { required: true, message: "Please input volume of Box" },
          {
            type: "number",
            min: 0,
            message: "Invalid volume",
          },
        ]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        name="price"
        label="Price"
        rules={[
          { required: true, message: "Please input price of Box" },
          {
            type: "number",
            min: 0,
            message: "Invalid price",
          },
        ]}
      >
        <InputNumber />
      </Form.Item>
    </>,
  ];
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <CRUDTemplate columns={columns} formItems={formItems} path="box" path2="allBox" />
    </div>
  );
}

export default ManageBox;
