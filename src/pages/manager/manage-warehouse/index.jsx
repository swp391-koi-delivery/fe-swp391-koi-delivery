import React from 'react'
import CRUDTemplate from '../../../components/crud-template'
import { Form, Input, InputNumber, Tag } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
function ManageWarehouse() {
    const columns = [
        { title: "ID", dataIndex: "id", key: "id",align: "left", },
        { title: "Location", dataIndex: "location", key: "location",align: "left", },
        { title: "Max Capacity", dataIndex: "maxCapacity", key: "maxCapacity",align: "left", },
        { title: "Current Capacity", dataIndex: "currentCapacity", key: "currentCapacity",align: "left", },
    ];
    const formItems = [
        <>
          <Form.Item name="id" hidden>
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please input warehouse name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="maxCapacity"
            label="Max Capacity"
            rules={[{ required: true, message: "Please input capacity" },{
              type: "number",
              min: 0,
              message: "Invalid capacity",
            },]}
          >
            <InputNumber />
          </Form.Item>
        </>,
      ];
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
        <CRUDTemplate columns={columns} formItems={formItems} path="wareHouse" path2="wareHouse/available"/>
    </div>
  )
}

export default ManageWarehouse