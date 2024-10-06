import { Button, Form, Modal, Popconfirm, Table } from "antd";
import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import api from "../../config/axios";

function CrudTemplate({ column, formItems, path }) {
  const [datas, setDatas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState([]);
  const tableColumn = [
    ...column,
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id, category) => (
        <>
          <Button
            type="primary"
            onClick={() => {
              setShowModal(true);
              form.setFieldsValue(category);
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete"
            description="Delete?"
            onConfirm={() => handleDelete(id)}
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
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

  //CREATE or UPDATE
  const handleSubmit = async (values) => {
    console.log(values);
    try {
      setLoading(true);

      if (values.id) {
        // => update
        const response = await api.put(`{path}/${values.id}`, values);
      } else {
        // => create
        const response = await api.post(path, values);
      }
      toast.success("Successfully saved!");
      fetchData();
      form.resetFields();
      setShowModal(false);
    } catch (err) {
      toast.error(err.response.data);
    } finally {
      setLoading(false);
    }
  };

  //DELETE
  const handleDelete = async (id) => {
    try {
      await api.delete(`{path}/${id}`);
      toast.success("Successfully deleted!");
      fetchData();
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //     {
  //       title: "ID",
  //       dataIndex: "id",
  //       key: "id",
  //     },
  //     {
  //       title: "Name",
  //       dataIndex: "name",
  //       key: "name",
  //     },
  //     {
  //       title: "Description",
  //       dataIndex: "description",
  //       key: "description",
  //     },
  //     {
  //       title: "Action",
  //       dataIndex: "id",
  //       key: "id",
  //       render: (id, category) => (
  //         <>
  //           <Button
  //             type="primary"
  //             onClick={() => {
  //               setShowModal(true);
  //               form.setFieldsValue(category);
  //             }}
  //           >
  //             Edit
  //           </Button>

  //           <Popconfirm
  //             title="Delete"
  //             description="Delete?"
  //             onConfirm={() => handleDelete(id)}
  //           >
  //             <Button type="primary" danger>
  //               Delete
  //             </Button>
  //           </Popconfirm>
  //         </>
  //       ),
  //     },
  //   ];

  return (
    <div>
      <Button onClick={() => setShowModal(true)}>Add</Button>
      <Table dataSource={datas} columns={tableColumn}></Table>

      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        title="Category"
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmit}>
          {formItems}
        </Form>
      </Modal>
    </div>
  );
}

export default CrudTemplate;

