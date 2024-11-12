import {
  Table,
  Input as AntInput,
  Popconfirm,
  Button,
  Modal,
  Form,
} from "antd";
import { useForm } from "antd/es/form/Form";
import Search from "antd/es/transfer/search";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DeleteOutlined, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import api from "../../config/axios";
function CRUDTemplate({ columns, formItems, path, path2 }) {
  //const api = "https://66ebf57e2b6cf2b89c5c9df5.mockapi.io/User";
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null); //Lưu người dùng đang chỉnh sửa
  const [form] = Form.useForm(); //Sử dụng Ant Design form
  const [submitting, setSubmitting] = useState(false); // tạo khoảng chờ khi nhấn submit
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const tableColumn = [
    ...columns,
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      align: "left",
      render: (id, record) => {
        if (record.available === false) {
          return null; // Không hiển thị nút khi trạng thái là 'Inactive'
        }
        return (
          <>
            {/* <Button
            icon={<EditTwoTone/>}
            onClick={() => {
              setOpenModal(true);
              form.setFieldsValue(record);
            }}
          />{" "} */}
            <Popconfirm
              title="Delete"
              description="Are you sure want to delete?"
              onConfirm={() => handleDelete(id)}
            >
              <Button icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </>
        );
      },
    },
  ];
  const fetchData = async () => {
    // const response = await axios.get(api);
    try {
      const response = await api.get(`manager/${path2}`);
      //lấy dữ liệu từ BE và set nó
      setUsers(Array.isArray(response.data) ? response.data : []);
      setFilteredUsers(Array.isArray(response.data) ? response.data : []); // khởi tạo filteredUsers bằng tất cả user
    } catch (error) {
      toast.error(error.response.data);
    }
    //console.log(response.data);
  };
  useEffect(() => {
    // chạy sự kiện fetchData
    fetchData();
  }, []);
  //tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value); // Cập nhật giá trị search text
    const filteredData = users.filter(
      (user) => user.fullname.toLowerCase().includes(value.toLowerCase()), // Lọc theo tên người dùng
    );
    setFilteredUsers(filteredData); // Cập nhật danh sách đã lọc
  };
  //tạo
  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      if (values.id) {
        const response = await api.put(`manager/${path}/${values.id}`, values);
      } else {
        const response = await api.post(`manager/${path}`, values);
      }
      toast.success("Submit successfully");
      form.resetFields();
      setOpenModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response.data);
    } finally {
      setSubmitting(false);
    }
  };
  //xóa
  const handleDelete = async (id) => {
    try {
      //await axios.delete(`${api}/${userId}`);
      await api.delete(`manager/${path}/${id}`);
      toast.success("Deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Fail to Delete!");
    }
  };
  return (
    <div>
      <Button
        icon={<PlusOutlined />}
        onClick={() => setOpenModal(true)}
        className="mb-4"
        style={{ marginLeft: "20px" }}
      >
        Add
      </Button>
      <Table columns={tableColumn} dataSource={users} rowKey="userId" />
      <Modal
        confirmLoading={submitting}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onOk={() => form.submit()}
        title="Update User"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {formItems}
        </Form>
      </Modal>

      {/* {previewImage && (
        <Image
          wrapperStyle={{
            display: "none",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )} */}
    </div>
  );
}

export default CRUDTemplate;
