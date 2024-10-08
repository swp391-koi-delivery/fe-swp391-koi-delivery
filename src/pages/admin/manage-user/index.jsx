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
} from "antd";
import { useForm } from "antd/es/form/Form";
import Search from "antd/es/transfer/search";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import { toast } from "react-toastify";
import { DeleteOutlined, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import api from "../../../config/axios";
import uploadFile from "../../../utils/file";
import "boxicons";
import "../index.css";
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
  const fetchUser = async () => {
    // const response = await axios.get(api);
    try {
      const response = await api.get("manager");
      //lấy dữ liệu từ BE và set nó
      setUsers(response.data);
      setFilteredUsers(response.data); // khởi tạo filteredUsers bằng tất cả user
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
      (user) => user.fullname.toLowerCase().includes(value.toLowerCase()) // Lọc theo tên người dùng
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
      const response = await api.post("manager",user);
      toast.success("Submit successfully");
      setFileList([])
      formAdd.resetFields();
      setShowModal(false);
      fetchUser();
    } catch (error) {
      toast.error(error.response.data);
    }finally{
      setSubmitting(false);
    }
  };
  //xóa user
  const handleDeleteUser = async (userId) => {
    try {
      //await axios.delete(`${api}/${userId}`);
      await api.delete(`manager/${userId}`);
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
      await api.put(`manager/${editingUser.userId}`, updatedUser);
      toast.success("Updated successfully");
      fetchUser(); // Cập nhật lại danh sách sau khi sửa
      handleCloseModal();
      setFileList([])
    } catch (error) {
      toast.error("Failed to update!");
    } finally {
      setSubmitting(false);
    }
  };
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
      
      title: "UserId",
      dataIndex: "userId",
      key: "userId",
    },
    {
      
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => {
        return <img src={image} alt="" width={130} height={150} />;
      },
    },
    {
      title: "FullName",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "UserName",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Loyalty Point",
      dataIndex: "loyaltyPoint",
      key: "loyaltyPoint",
      sorter: (a, b) => a.loyaltyPoint - b.loyaltyPoint, // Sắp xếp theo loyaltyPoint
    },
    {
      title: "Userstatus",
      dataIndex: "userstatus",
      key: "userstatus",
      render: (userstatus) => (userstatus ? "Inactive" : "Active"),
      filters: [
        { text: "Inactive", value: true },
        { text: "Active", value: false },
      ],
      onFilter: (value, record) => record.status === value, // Lọc theo status
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      filters: [
        { text: "MANAGER", value: "MANAGER" },
        { text: "SALESSTAFF", value: "SALESSTAFF" },
        { text: "DELIVERINGSTAFF", value: "DELIVERINGSTAFF" },
        { text: "CUSTOMER", value: "CUSTOMER" },
      ],
      onFilter: (value, record) => record.role === value, // Lọc theo role
    },
    {
      title: "Action",
      dataIndex: "userId",
      key: "userId",
      render: (userId, record) => {
        return (
          <>
            <Button icon={<EditTwoTone/>} onClick={() => handleOpenModal(record)}/>{" "}
            <Popconfirm
              title="Delete"
              description="Are you sure want to delete?"
              onConfirm={() => handleDeleteUser(userId)}
            >
              <Button icon={<DeleteOutlined />}danger />
            </Popconfirm>
          </>
        );
      },
    },
  ];
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <div  className="mb-4" style={{width:"350px"}}>

      <Search
        placeholder="Search by fullname"
        onSearch={handleSearch}
        onChange={(e) => handleSearch(e.target.value)} // Cập nhật khi người dùng gõ
        value={searchText}
        // Thêm style cho input search
        className="w-full max-w-md"
        />
        </div>
      <Button icon={<PlusOutlined/>} onClick={() => setShowModal(true)} className="mb-4" style={{marginLeft:"20px"}}>Add</Button>
      <Table columns={columns} dataSource={filteredUsers} rowKey="userId" size="middle" />
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
                max: 100,
                message: "Invalid loyalty point",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item name="userstatus" label="Userstatus">
            <Select>
              <Select.Option value={true}>Inactive</Select.Option>
              <Select.Option value={false}>Active</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Select>
              <Select.Option value="SALESSTAFF">SALESSTAFF</Select.Option>
              <Select.Option value="DELIVERINGSTAFF">
                DELIVERINGSTAFF
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
                message: "Please imput username!",
              },
            ]}
          >
            <AntInput />
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
          <Form.Item name="userstatus" label="Userstatus">
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
              <Select.Option value="SALESSTAFF">SALESSTAFF</Select.Option>
              <Select.Option value="DELIVERINGSTAFF">
                DELIVERINGSTAFF
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
