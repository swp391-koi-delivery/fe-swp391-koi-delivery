import React, { useState, useEffect } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import api from "../../config/axios";
import { useParams } from "react-router-dom"; // To get the userId from the route
import "./ProfileUser.css";

const ProfileUser = () => {
  const { id } = useParams(); // Assuming userId comes from the route
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullname: "",
    address: "",
    phone: "",
    email: "",
    image: "", // Added profileImage field
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user data on component load
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`manager/${id}`); // Dynamically fetch user data by id
        setFormData(response.data); // Populate form fields with API response data
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "username":
        error =
          value.length < 3 ? "Username must be at least 3 characters long" : "";
        break;
      case "password":
        error =
          value.length < 8 ? "Password must be at least 8 characters long" : "";
        break;
      case "confirmPassword":
        error = value !== formData.password ? "Passwords do not match" : ""; // Validate confirm password
        break;
      case "email":
        error = !/\S+@\S+\.\S+/.test(value) ? "Invalid email address" : "";
        break;
      case "phone":
        error = !/^\d{10}$/.test(value) ? "Phone number must be 10 digits" : "";
        break;
      default:
        break;
    }
    setErrors({ ...errors, [name]: error });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (id) => {
    setLoading(true);
    try {
      await api.put(`manager/${id}`, formData); // Send the updated data
      setLoading(false);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4 text-gray-100">
      <div className="w-full max-w-4xl overflow-hidden rounded-lg bg-gray-800 shadow-xl">
        <div className="p-6 md:p-8 lg:p-12">
          <h2 className="mb-6 text-center text-3xl font-bold">
            {isEditing ? "Update Profile" : formData.username}
          </h2>
          <div className="mb-8 flex justify-center">
            <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-gray-700">
              {formData.image ? (
                <img
                  src={formData.image} // Display image from API
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <FaUser className="text-4xl text-gray-400" /> // Default icon if no image
              )}
              {isEditing && (
                <label
                  htmlFor="profile-image"
                  className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity hover:opacity-100"
                >
                  <span className="text-sm text-white">Change Photo</span>
                  <input
                    type="file"
                    id="profile-image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {isEditing && (
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full rounded-md bg-gray-700 py-2 pl-3 pr-10 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-invalid={errors.password ? "true" : "false"}
                      aria-describedby="password-error"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <p
                      id="password-error"
                      className="mt-2 text-sm text-red-500"
                    >
                      {errors.password}
                    </p>
                  )}
                </div>
              )}
              {isEditing && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium"
                  >
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-md bg-gray-700 py-2 pl-3 pr-10 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-invalid={errors.password ? "true" : "false"}
                    aria-describedby="confirm-password-error"
                  />
                  {errors.confirmPassword && (
                    <p
                      id="confirm-password-error"
                      className="mt-2 text-sm text-red-500"
                    >
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}
              <div>
                <label
                  htmlFor="fullname"
                  className="mb-2 block text-sm font-medium"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full rounded-md bg-gray-700 px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-md bg-gray-700 py-2 pl-10 pr-3 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!isEditing}
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby="email-error"
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="mt-2 text-sm text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium"
                >
                  Phone
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-md bg-gray-700 py-2 pl-10 pr-3 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!isEditing}
                    aria-invalid={errors.phone ? "true" : "false"}
                    aria-describedby="phone-error"
                  />
                </div>
                {errors.phone && (
                  <p id="phone-error" className="mt-2 text-sm text-red-500">
                    {errors.phone}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium"
                >
                  Address
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full rounded-md bg-gray-700 py-2 pl-10 pr-3 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={toggleEdit}
                className={`btn-edit rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 ${loading && "opacity-50"}`}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
              {isEditing && (
                <button
                  type="submit"
                  className={`btn-save rounded-md bg-green-600 px-4 py-2 text-white transition hover:bg-green-700 ${loading && "opacity-50"}`}
                  disabled={loading}
                >
                  {loading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileUser;
