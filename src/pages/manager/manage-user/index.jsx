import {
  Table,
  Input as AntInput,
  Popconfirm,
  Button,
  Modal,
  Form,
  Select,
  Switch,
  message,
  InputNumber,
  Upload,
  Image,
  Tag,
  Input,
} from "antd";
import { useForm } from "antd/es/form/Form";
import Search from "antd/es/transfer/search";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import { createStyles } from "antd-style";
import { toast } from "react-toastify";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import api from "../../../config/axios";
import uploadFile from "../../../utils/file";
import "boxicons";
import "./index.css";
function ManageUser() {
  //const api = "https://66ebf57e2b6cf2b89c5c9df5.mockapi.io/User";
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null); //Lưu người dùng đang chỉnh sửa
  const [form] = Form.useForm(); //Sử dụng Ant Design form
  const [formAdd] = Form.useForm(); //Sử dụng Ant Design form
  const [submitting, setSubmitting] = useState(false); // tạo khoảng chờ khi nhấn submit
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const useStyle = createStyles(({ css, token }) => {
    const { antCls } = token;
    return {
      customTable: css`
        ${antCls}-table {
          ${antCls}-table-container {
            ${antCls}-table-body,
            ${antCls}-table-content {
              scrollbar-width: thin;
              scrollbar-color: unset;
            }
          }
        }
      `,
    };
  });
  const fetchUser = async () => {
    // const response = await axios.get(api);
    try {
      const response = await api.get("manager/allUser?page=1&size=1000000000");
      //lấy dữ liệu từ BE và set nó
      // setUsers(response.data);
      // setFilteredUsers(response.data); // khởi tạo filteredUsers bằng tất cả user
      setUsers(Array.isArray(response.data.content) ? response.data.content : []);
      setFilteredUsers(Array.isArray(response.data.content) ? response.data.content : []);
      console.log(response.data.content);
    } catch (error) {
      toast.error(error.response.data);
    }
    //console.log(response.data);
  };
  useEffect(() => {
    // chạy sự kiện fetchUser
    fetchUser();
  }, []);
  //tìm kiếm user
  const handleSearch = (value) => {
    setSearchText(value); // Cập nhật giá trị search text
    const filteredData = users.filter(
      (user) => user.fullname.toLowerCase().includes(value.toLowerCase()), // Lọc theo tên người dùng
    );
    setFilteredUsers(filteredData); // Cập nhật danh sách đã lọc
  };
  //tạo user
  const handleSubmitUser = async (user) => {
    if (fileList.length > 0) {
      const file = fileList[0];
      const url = await uploadFile(file.originFileObj); // Gọi hàm upload file
      //console.log(url);
      user.image = url; // Cập nhật URL ảnh vào đối tượng người dùng
    }
    try {
      setSubmitting(true);
      const response = await api.post("manager/user", user);
      toast.success("Submit successfully");
      setFileList([]);
      formAdd.resetFields();
      setShowModal(false);
      fetchUser();
    } catch (error) {
      toast.error(error.response.data);
    } finally {
      setSubmitting(false);
    }
  };
  //xóa user
  const handleDeleteUser = async (id) => {
    try {
      //await axios.delete(`${api}/${userId}`);
      await api.delete(`manager/${id}`);
      toast.success("Deleted successfully");
      fetchUser();
    } catch (error) {
      toast.error("Fail to Delete!");
    }
  };
  // cập nhật user
  const handleUpdateUser = async () => {
    try {
      setSubmitting(true);
      const updatedUser = { ...editingUser, ...form.getFieldsValue() }; // Lấy giá trị mới từ form

      // Nếu có ảnh trong fileList, tiến hành upload
      if (fileList.length > 0) {
        const file = fileList[0];
        const url = await uploadFile(file.originFileObj); // Gọi hàm upload file
        //console.log(url);
        updatedUser.image = url; // Cập nhật URL ảnh vào đối tượng người dùng
      }

      //await axios.put(`${api}/${editingUser.userId}`, updatedUser);
      //console.log(editingUser.userId);
      await api.put(`manager/${editingUser.id}`, {
        image: updatedUser.image,
        role: updatedUser.role,
        loyaltyPoint: updatedUser.loyaltyPoint,
        deleted: updatedUser.deleted,
      });
      toast.success("Updated successfully");
      fetchUser(); // Cập nhật lại danh sách sau khi sửa
      handleCloseModal();
      setFileList([]);
    } catch (error) {
      toast.error("Failed to update!");
    } finally {
      setSubmitting(false);
    }
  };
  const { styles } = useStyle();
  //mở modal
  const handleOpenModal = (user) => {
    setEditingUser(user); // Lưu người dùng đang được chỉnh sửa
    form.setFieldsValue(user); // Đặt giá trị ban đầu cho form với thông tin người dùng
    setOpenModal(true);
  };
  //đóng modal
  const handleCloseModal = () => {
    setOpenModal(false);
    form.resetFields(); // Reset form khi đóng Modal
  };
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  const columns = [
    {
      title: <span className="custom-table-header">ID</span>,
      dataIndex: "id",
      key: "id",
      align: "left",
    },
    {
      title: <span className="custom-table-header">Image</span>,
      dataIndex: "image",
      key: "image",
      render: (image) => {
        return <img src={image} alt="" width={130} height={150} />;
      },
    },
    {
      title: <span className="custom-table-header">FullName</span>,
      dataIndex: "fullname",
      key: "fullname",
      align: "left",
    },
    {
      title: <span className="custom-table-header">UserName</span>,
      dataIndex: "username",
      key: "username",
      align: "left",
    },
    {
      title: <span className="custom-table-header">Address</span>,
      dataIndex: "address",
      key: "address",
      align: "left",
    },
    {
      title: <span className="custom-table-header">Phone</span>,
      dataIndex: "phone",
      key: "phone",
      align: "left",
    },
    {
      title: <span className="custom-table-header">Email</span>,
      dataIndex: "email",
      key: "email",
      align: "left",
    },
    {
      title: <span className="custom-table-header">Loyalty Point</span>,
      dataIndex: "loyaltyPoint",
      key: "loyaltyPoint",
      align: "left",
      sorter: (a, b) => a.loyaltyPoint - b.loyaltyPoint,
    },
    {
      title: <span className="custom-table-header">User Status</span>,
      dataIndex: "deleted",
      key: "deleted",
      align: "left",

      render: (userstatus) => (
        <Tag
          style={{ fontSize: "22px" }}
          icon={userstatus ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
          color={userstatus ? "error" : "success"} // Màu đỏ cho Inactive, xanh cho Active
        >
          {userstatus ? "Inactive" : "Active"}
        </Tag>
      ),
      filters: [
        { text: "Inactive", value: true },
        { text: "Active", value: false },
      ],
      onFilter: (value, record) => record.status === value, // Lọc theo status
    },
    {
      title: <span className="custom-table-header">Role</span>,
      dataIndex: "role",
      key: "role",
      align: "left",
      filters: [
        { text: "MANAGER", value: "MANAGER" },
        { text: "SALE_STAFF", value: "SALE_STAFF" },
        { text: "DELIVERING_STAFF", value: "DELIVERING_STAFF" },
        { text: "CUSTOMER", value: "CUSTOMER" },
      ],
      onFilter: (value, record) => record.role === value, // Lọc theo role
    },
    {
      title: <span className="custom-table-header">Action</span>,
      dataIndex: "id",
      fixed: "right",
      key: "id",
      render: (id, record) => {
        if (record.deleted === true) {
          return null; // Không hiển thị nút khi trạng thái là 'Inactive'
        }
        return (
          <>
            <Button
              icon={<EditTwoTone />}
              onClick={() => handleOpenModal(record)}
            />
            <Popconfirm
              title="Delete"
              description="Are you sure want to delete?"
              onConfirm={() => handleDeleteUser(id)}
            >
              <Button icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-8">
      <h1 className="mb-6 text-2xl font-bold">User Management</h1>
      <div className="mb-4" style={{ width: "350px" }}>
        <Search
          placeholder="Search by fullname"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)} // Cập nhật khi người dùng gõ
          value={searchText}
          // Thêm style cho input search
          className="w-full max-w-md"
        />
      </div>
      <Button
        icon={<PlusOutlined />}
        onClick={() => setShowModal(true)}
        className="mb-4"
        style={{ marginLeft: "20px" }}
      >
        Add
      </Button>
      <Table
        className={styles.customTable}
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        size="middle"
        scroll={{
          x: "max-content",
        }}
      />
      <Modal
        confirmLoading={submitting}
        open={openModal}
        onCancel={handleCloseModal}
        onOk={handleUpdateUser}
        title="Update User"
      >
        <Form form={form} layout="vertical">
          {/* <Form.Item
            name="username"
            label="UserName"
            rules={[
              {
                required: true,
                message: "Please imput username!",
              },
              {
                min: 6,
                message: "Username must be at least 6 characters",
              },
            ]}
          >
            <AntInput />
          </Form.Item> */}
          {/* <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please imput username!",
              },
            ]}
          >
            <AntInput />
          </Form.Item> */}
          {/* <Form.Item
            name="fullname"
            label="FullName"
            rules={[
              {
                required: true,
                message: "Please imput fullname!",
              },
            ]}
          >
            <AntInput />
          </Form.Item> */}
          {/* <Form.Item
            name="address"
            label="Address"
            rules={[
              {
                required: true,
                message: "Please input address!",
              },
            ]}
          >
            <AntInput />
          </Form.Item> */}
          {/* <Form.Item
            name="phone"
            label="Phone"
            rules={[
              {
                required: true,
                message: "Please input phone number!",
              },
              {
                pattern: "^0[0-9]{9}$",
                message: "Invalid format!(0*********)",
              },
            ]}
          >
            <AntInput />
          </Form.Item> */}
          {/* <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Please input email!",
              },
              {
                type: "email",
                message: "Invalid email's format!",
              },
            ]}
          >
            <AntInput />
          </Form.Item> */}
          <Form.Item
            name="loyaltyPoint"
            label="LoyaltyPoint"
            rules={[
              {
                required: true,
                message: "Please input loyalty point!",
              },
              {
                type: "number",
                min: 0,
                message: "Invalid loyalty point",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item name="deleted" label="Status">
            <Select>
              <Select.Option value={true}>Inactive</Select.Option>
              <Select.Option value={false}>Active</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Select>
              <Select.Option value="SALE_STAFF">SALE_STAFF</Select.Option>
              <Select.Option value=" DELIVERING_STAFF">
                DELIVERING_STAFF
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="image" name="image">
            <Upload
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        confirmLoading={submitting}
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={() => formAdd.submit()}
        title="Submit User"
      >
        <Form form={formAdd} layout="vertical" onFinish={handleSubmitUser}>
          <Form.Item
            name="username"
            label="UserName"
            rules={[
              {
                required: true,
                message: "Please imput username!",
              },
              {
                min: 6,
                message: "Username must be at least 6 characters",
              },
            ]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please imput password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="fullname"
            label="FullName"
            rules={[
              {
                required: true,
                message: "Please imput fullname!",
              },
            ]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[
              {
                required: true,
                message: "Please input address!",
              },
            ]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              {
                required: true,
                message: "Please input phone number!",
              },
              {
                pattern: "^0[0-9]{9}$",
                message: "Invalid format!(0*********)",
              },
            ]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Please input email!",
              },
              {
                type: "email",
                message: "Invalid email's format!",
              },
            ]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="loyaltyPoint"
            label="LoyaltyPoint"
            rules={[
              {
                required: true,
                message: "Please input loyalty point!",
              },
              {
                type: "number",
                min: 0,
                max: 100,
                message: "Invalid loyalty point",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item name="deleted" label="Status">
            <Select>
              <Select.Option value={true}>Inactive</Select.Option>
              <Select.Option value={false}>Active</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[
              {
                required: true,
                message: "Please choose role",
              },
            ]}
          >
            <Select>
              <Select.Option value="SALE_STAFF">SALE_STAFF</Select.Option>
              <Select.Option value="DELIVERING_STAFF">
                DELIVERING_STAFF
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="image" name="image">
            <Upload
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      {previewImage && (
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
      )}
    </div>
  );
}

export default ManageUser;
