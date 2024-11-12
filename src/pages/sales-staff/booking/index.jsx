import React, { useState } from 'react';
import api from '../../../config/axios'
import { toast } from 'react-toastify';
import { Input, Button, InputNumber, Form,Row, Col } from 'antd';
function Booking({id}) {
    const [warehouseId, setWarehouseId] = useState('');
    const [form] = Form.useForm();
    // Hàm xử lý khi nhấn nút OK
    const handleSubmit = async () => {
      try {
        
        const response = await api.post(`sale/warehouse/bookingSlot?wareHouseId=${warehouseId}&orderId=${id}`);
        toast.success("Booking successfully")
        console.log(response.data);
      } catch (error) {
        console.error('Error booking slot:', error);
        toast.error("Fail to booking");
      }
    };
  
    return (
        <div className="p-6 bg-white border rounded-md shadow-md max-w-4xl mx-auto">
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Order ID (disabled input) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Order ID:</label>
            <Input
              value={id}
              disabled
              className="w-full"
            />
          </div>

          {/* Warehouse ID with number input */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="warehouseId">Warehouse ID:</label>
            <Form.Item
              name="warehouseId"
              rules={[
                { required: true, message: 'Warehouse ID is required' },
                { type: 'number', min: 0, message: 'Warehouse ID cannot be negative' },
              ]}
            >
              <InputNumber
                id="warehouseId"
                value={warehouseId}
                onChange={(value) => setWarehouseId(value)}
                className="w-full"
                placeholder="Enter Warehouse ID"
                min={0} // Không cho phép số âm
              />
            </Form.Item>
          </div>
        </div>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          OK
        </Button>
      </Form>
    </div>
    );
}

export default Booking