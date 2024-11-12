import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Form, Input, Button, message, Upload } from "antd";
import { FaCheck, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import { PlusOutlined } from "@ant-design/icons";
import api from "../../../config/axios";
import uploadFile from "../../../utils/file";


function StaffProfile() {
    const [profileData, setProfileData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    useEffect(() => {
      const fetchProfileData = async () => {
        try {
          const response = await api.get("sale/profile");
          setProfileData(response.data);
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      };
      fetchProfileData();
    }, []);
  
  
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
                  src={profileData.image || "../assets/images/vodanh.jpg"}
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
                <p className="text-sm font-medium text-gray-500">
                  Account Status
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {profileData.deleted ? "Inactive" : "Active"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default StaffProfile