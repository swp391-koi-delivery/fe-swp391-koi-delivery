import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Upload, Image } from "antd";
import { FaLock } from "react-icons/fa";
import api from "../../config/axios";
import { toast } from "react-toastify";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../utils/file";

const UserProfile = ({ token }) => {
  const [user, setUser] = useState({});
  const [profileData, setProfileData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await api.get(`user`);
        if (response.data) {
          setUser(response.data);
          setProfileData(response.data);
          console.log("Profile Data:", response.data);
        } else {
          console.warn("No data found in response");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
  }, [token]);

  const handleUpdateProfile = async (values) => {
    if (fileList.length > 0) {
      const file = fileList[0];
      const url = await uploadFile(file.originFileObj);
      values.image = url;
    }
    try {
      await api.put(`user/${profileData.id}`, values);
      toast.success("Profile updated successfully!");
      setProfileData((prev) => ({ ...prev, ...values }));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
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
    form.setFieldsValue(profileData); // Set default values
    setIsModalOpen(true);
  };
  console.log(profileData);
  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!profileData) {
    return <div>Loading...</div>;
  }

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
                src={profileData?.image || "https://via.placeholder.com/150"}
                alt="Profile"
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
                {profileData?.username || "N/A"}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p className="text-lg font-semibold text-gray-900">
                {profileData?.fullname || "N/A"}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-lg font-semibold text-gray-900">
                {profileData?.email || "N/A"}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-500">Phone Number</p>
              <p className="text-lg font-semibold text-gray-900">
                {profileData?.phone || "N/A"}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4 md:col-span-2">
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p className="text-lg font-semibold text-gray-900">
                {profileData?.address || "N/A"}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-500">
                Loyalty Points
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {profileData?.loyaltyPoint || 0} pts
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
            open={isModalOpen}
            onCancel={closeModal}
            onOk={() => form.submit()}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateProfile}
              initialValues={profileData || {}}
            >
              {/* Add form items as before */}
            </Form>
          </Modal>
        </div>
      </div>
      {previewImage && (
        <Image
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
};

export default UserProfile;
