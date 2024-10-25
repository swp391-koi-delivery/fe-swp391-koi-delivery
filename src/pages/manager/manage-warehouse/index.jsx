import React from 'react'
import CRUDTemplate from '../../../components/crud-template'
import { Form, Input, InputNumber, Tag } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
function ManageWarehouse() {
    const columns = [
        { title: "ID", dataIndex: "id", key: "id",align: "left", },
        { title: "Location", dataIndex: "location", key: "location",align: "left", },
        { title: "Available", dataIndex: "available", key: "available",align: "left", render: (available) => (<Tag style={{fontSize:"22px"}}
            icon={available ? <CloseCircleOutlined /> : <CheckCircleOutlined />} 
            color={available ? 'success' : 'error'} // Màu đỏ cho Inactive, xanh cho Active
          >
            {available ? 'Available' : 'Unavailable'}
          </Tag>),},
    ];

    const formItems = [
        <>
          <Form.Item name="id" hidden>
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please input type of Box" }]}
          >
            <Input />
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