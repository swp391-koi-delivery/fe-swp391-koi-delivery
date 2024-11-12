import { Button, Form, Modal, Popconfirm, Table } from "antd";
import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import api from "../../config/axios";

function CrudTemplate({ columns, formItems, path }) {
  const [datas, setDatas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState([]);
  const tableColumn = [
    ...columns,
  ];

  //GET
  const fetchData = async () => {
    try {
      const response = await api.get(path);
      setDatas(response.data);
    } catch (err) {
      toast.error(err.response.data);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  

  return (
    <div>
      <Table dataSource={datas} columns={tableColumn}></Table>
    </div>
  );
}

export default CrudTemplate;
