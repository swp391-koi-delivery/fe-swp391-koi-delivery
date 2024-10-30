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
import Password from "antd/es/input/Password";
import api from "../../config/axios";
import uploadFile from "../../utils/file";
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
  // cập nhật
  // const handleUpdateUser = async () => {
  //   try {
  //     setSubmitting(true);
  //     const updatedUser = { ...editingUser, ...form.getFieldsValue() }; // Lấy giá trị mới từ form
  //     await api.put(`${path}/${editingUser.userId}`, updatedUser);
  //     toast.success("Updated successfully");
  //     fetchData(); // Cập nhật lại danh sách sau khi sửa
  //     handleCloseModal();
  //   } catch (error) {
  //     toast.error("Failed to update!");
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };
  //mở modal
  // const handleOpenModal = (user) => {
  //   setEditingUser(user); // Lưu người dùng đang được chỉnh sửa
  //   form.setFieldsValue(user); // Đặt giá trị ban đầu cho form với thông tin người dùng
  //   setOpenModal(true);
  // };
  // //đóng modal
  // const handleCloseModal = () => {
  //   setOpenModal(false);
  //   form.resetFields(); // Reset form khi đóng Modal
  // };
  //   const getBase64 = (file) =>
  //     new Promise((resolve, reject) => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file);
  //       reader.onload = () => resolve(reader.result);
  //       reader.onerror = (error) => reject(error);
  //     });
  //   const handlePreview = async (file) => {
  //     if (!file.url && !file.preview) {
  //       file.preview = await getBase64(file.originFileObj);
  //     }
  //     setPreviewImage(file.url || file.preview);
  //     setPreviewOpen(true);
  //   };
  //   const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  //   const uploadButton = (
  //     <button
  //       style={{
  //         border: 0,
  //         background: "none",
  //       }}
  //       type="button"
  //     >
  //       <PlusOutlined />
  //       <div
  //         style={{
  //           marginTop: 8,
  //         }}
  //       >
  //         Upload
  //       </div>
  //     </button>
  //   );
  //   const columns = [
  //     {
  //       title: "UserId",
  //       dataIndex: "userId",
  //       key: "userId",
  //     },
  //     {
  //       title: "Image",
  //       dataIndex: "image",
  //       key: "image",
  //       render: (image) => {
  //         return <img src={image} alt="" width={170} height={200} />;
  //       },
  //     },
  //     {
  //       title: "FullName",
  //       dataIndex: "fullname",
  //       key: "fullname",
  //     },
  //     {
  //       title: "UserName",
  //       dataIndex: "username",
  //       key: "username",
  //     },
  //     {
  //       title: "Password",
  //       dataIndex: "password",
  //       key: "password",
  //       // render: () => "******",
  //     },
  //     {
  //       title: "Address",
  //       dataIndex: "address",
  //       key: "address",
  //     },
  //     {
  //       title: "Phone",
  //       dataIndex: "phone",
  //       key: "phone",
  //     },
  //     {
  //       title: "Email",
  //       dataIndex: "email",
  //       key: "email",
  //     },
  //     {
  //       title: "Loyalty Point",
  //       dataIndex: "loyaltyPoint",
  //       key: "loyaltyPoint",
  //       sorter: (a, b) => a.loyaltyPoint - b.loyaltyPoint, // Sắp xếp theo loyaltyPoint
  //     },
  //     {
  //       title: "Status",
  //       dataIndex: "enabled",
  //       key: "enabled",
  //       render: (enabled) => (enabled ? "True" : "False"),
  //       filters: [
  //         { text: "True", value: true },
  //         { text: "False", value: false },
  //       ],
  //       onFilter: (value, record) => record.status === value, // Lọc theo roleName
  //     },
  //     {
  //       title: "Role",
  //       dataIndex: "role",
  //       key: "role",
  //       filters: [
  //         { text: "MANAGER", value: "MANAGER" },
  //         { text: "SALESSTAFF", value: "SALESSTAFF" },
  //         { text: "DELIVERINGSTAFF", value: "DELIVERINGSTAFF" },
  //         { text: "CUSTOMER", value: "CUSTOMER" },
  //       ],
  //       onFilter: (value, record) => record.role === value, // Lọc theo role
  //     },
  //     {
  //       title: "Action",
  //       dataIndex: "userId",
  //       key: "userId",
  //       render: (userId, record) => {
  //         return (
  //           <>
  //             <Button type="primary" onClick={() => handleOpenModal(record)}>
  //               Edit
  //             </Button>{" "}
  //             <Popconfirm
  //               title="Delete"
  //               description="Are you sure want to delete?"
  //               onConfirm={() => handleDeleteUser(userId)}
  //             >
  //               <Button type="primary" danger>
  //                 Delete
  //               </Button>
  //             </Popconfirm>
  //           </>
  //         );
  //       },
  //     },
  //   ];
  return (
    <div>
      {/* <div style={{width:"500px"}}>    
      <Search
        placeholder="Search..."
        onSearch={handleSearch}
        onChange={(e) => handleSearch(e.target.value)} // Cập nhật khi người dùng gõ
        value={searchText}
        style={{ marginBottom: 20, width: 300 }} // Thêm style cho input search
        />
        </div> */}
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
