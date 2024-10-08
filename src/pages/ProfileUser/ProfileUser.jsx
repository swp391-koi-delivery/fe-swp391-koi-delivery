import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaSpinner, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import api from "../../config/axios";
import { useParams } from "react-router-dom"; // To get the userId from the route

const ProfileUser = () => {
  const { userId } = useParams(); // Assuming userId comes from the route
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "", // Added confirmPassword field
    fullname: "",
    address: "",
    phone: "",
    email: "",
    image: "" // Added profileImage field
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user data on component load
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`manager/${userId}`);
        setFormData(response.data); // Populate form fields with API response data
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "username":
        error = value.length < 3 ? "Username must be at least 3 characters long" : "";
        break;
      case "password":
        error = value.length < 8 ? "Password must be at least 8 characters long" : "";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`manager/${userId}`, formData); // Send the updated data
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
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 md:p-8 lg:p-12">
          <h2 className="text-3xl font-bold mb-6 text-center">
            {isEditing ? "Update Profile" : formData.username}
          </h2>
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center relative">
              {formData.image ? (
                <img
                  src={formData.image} // Display image from API
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser className="text-4xl text-gray-400" /> // Default icon if no image
              )}
              {isEditing && (
                <label
                  htmlFor="profile-image"
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer transition-opacity opacity-0 hover:opacity-100"
                >
                  <span className="text-white text-sm">Change Photo</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isEditing && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-3 pr-10 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      aria-invalid={errors.password ? "true" : "false"}
                      aria-describedby="password-error"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <p id="password-error" className="mt-2 text-sm text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>
              )}
              {isEditing && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-3 pr-10 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                    aria-describedby="confirm-password-error"
                  />
                  {errors.confirmPassword && (
                    <p id="confirm-password-error" className="mt-2 text-sm text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}
              <div>
                <label htmlFor="fullname" className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                <label htmlFor="address" className="block text-sm font-medium mb-2">
                  Address
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={toggleEdit}
                className={`py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition ${loading && "opacity-50"}`}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
              {isEditing && (
                <button
                  type="submit"
                  className={`py-2 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 transition ${loading && "opacity-50"}`}
                  disabled={loading}
                >
                  {loading ? <FaSpinner className="animate-spin" /> : "Save Changes"}
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
