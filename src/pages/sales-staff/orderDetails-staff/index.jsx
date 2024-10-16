import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

function OrderDetailStaff() {
    const [orders, setOrders] = useState([]);
    const { id } = useParams();

    const fetchOrders = async () => {
          const response = await api.get("order");
          const fetchedOrders = response.data; 
          console.log(fetchOrders);
    }
  
  useEffect(() => {
    fetchOrders();
  }, [id]);

  return (
    <div>OrderDetailStaff: </div>
  )
}

export default OrderDetailStaff