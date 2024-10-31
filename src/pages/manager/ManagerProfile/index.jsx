import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Form, Input, Button, message, Upload } from "antd";
import { FaCheck, FaLock } from "react-icons/fa";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../../utils/file";
const ManageProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await api.get("manager/profile");
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
  }, []);

  const handleUpdateProfile = async (values) => {
    if (fileList.length > 0) {
      const file = fileList[0];
      const url = await uploadFile(file.originFileObj); // Gọi hàm upload file
      //console.log(url);
      values.image = url; // Cập nhật URL ảnh vào đối tượng người dùng
    }
    try {
      await api.put(`user/${profileData.id}`, values);
      toast.success("Profile updated successfully!");
      setProfileData((prev) => ({ ...prev, ...values }));
      setIsModalOpen(false);
    } catch (error) {
      //console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
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

  const openModal = () => {
    form.setFieldsValue(profileData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!profileData) {
    return <div>Loading...</div>;
  }
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-8">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-xl bg-white shadow-lg">
        <div className="p-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Profile Information
            </h2>
          </div>

          <div className="mb-6 text-center">
            <div className="relative inline-block">
              <img
                src={profileData.image || "../public/assets/images/vodanh.jpg"}
                alt=""
                className="h-32 w-32 rounded-full border-4 border-blue-100 object-cover"
              />
              <div className="absolute bottom-0 right-0 rounded-full bg-blue-500 p-2">
                <FaLock className="text-white" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-500">Username</p>
              <p className="text-lg font-semibold text-gray-900">
                {profileData.username}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p className="text-lg font-semibold text-gray-900">
                {profileData.fullname}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-lg font-semibold text-gray-900">
                {profileData.email}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-500">Phone Number</p>
              <p className="text-lg font-semibold text-gray-900">
                {profileData.phone}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4 md:col-span-2">
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p className="text-lg font-semibold text-gray-900">
                {profileData.address}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-500">Balance</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatPrice(profileData.balance || 0)}
              </p>
            </div>

            {/* <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Email Status</p>
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                <p className="text-lg font-semibold text-gray-900">{profileData.emailStatus}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Loyalty Points</p>
              <p className="text-lg font-semibold text-gray-900">{profileData.loyaltyPoint} pts</p>
            </div> */}

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-500">
                Account Status
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {profileData.deleted ? "Inactive" : "Active"}
              </p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Button type="primary" onClick={openModal}>
              Update Profile
            </Button>
          </div>

          <Modal
            title="Update Profile"
            visible={isModalOpen}
            onCancel={closeModal}
            onOk={() => form.submit()}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateProfile}
              initialValues={profileData}
            >
              <Form.Item
                label="Username"
                name="username"
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
                <Input disabled/>
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
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
                label="Full Name"
                name="fullname"
                rules={[
                  {
                    required: true,
                    message: "Please imput fullname!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
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
                <Input />
              </Form.Item>
              <Form.Item
                label="Phone"
                name="phone"
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
                <Input />
              </Form.Item>
              <Form.Item
                label="Address"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please input address!",
                  },
                ]}
              >
                <Input />
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
        </div>
      </div>
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
};

export default ManageProfile;
