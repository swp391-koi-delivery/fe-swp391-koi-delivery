import React from "react";
import CrudTemplate from "../../../components/crud-template/CrudTemplate";
import { Form } from "react-router-dom";
import { Input } from "antd";

function ManageOrder() {
  const column = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];

  const formItems = (
    <>
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="name" label="Name">
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea />
      </Form.Item>
    </>
  );
  return (
    <>
      <CrudTemplate
        column={column}
        formItems={formItems}
        path="order"
      />
    </>
  );
}

export default ManageOrder;
