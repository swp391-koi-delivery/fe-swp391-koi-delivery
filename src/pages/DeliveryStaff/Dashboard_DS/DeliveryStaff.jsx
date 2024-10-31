import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaListAlt,
  FaComments,
  FaMapMarkedAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/features/userSlice";
import { toast } from "react-toastify";
import { useNavigate, Outlet } from "react-router-dom"; // Combine imports from react-router-dom

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("2");
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tabs = [
    { key: "1", icon: FaUser, label: "Profile User", path: "deliStaffProfile" },
    {
      key: "2",
      icon: FaListAlt,
      label: "List Orders",
      path: "listOrders_Deli",
    },
    // { key: "3", icon: FaComments, label: "Chat", path: "chat_Deli" },
    {
      key: "3",
      icon: FaMapMarkedAlt,
      label: "Map & Routing",
      path: "MapComponent",
    },
    { key: "4", icon: FaSignOutAlt, label: "Log Out" },
  ];

  const pageVariants = {
    initial: { opacity: 0, y: 50 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -50 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    toast.success("Logout successfully");
  };

  const handleTabChange = (tab) => {
    if (tab.key === "4") {
      setActiveTab(tab.key);
    } else if (activeTab !== tab.key) {
      // Only navigate if tabs are different
      setActiveTab(tab.key);
      setTimeout(() => {
        navigate(tab.path); // Navigate to the path of the selected tab after animation
      }, 500);
      C; // Match the time with the transition time
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "4": //  log Out
        return (
          <div className="flex h-full items-center justify-center">
            <div className="space-y-4 text-center">
              <h3 className="text-2xl font-bold">
                Are you sure you want to log out?
              </h3>
              <div className="space-x-4">
                <button
                  onClick={() => setActiveTab("2")} // Cancel back to Order List
                  className="rounded-full bg-gray-500 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-red-500 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:bg-red-600"
                >
                  Confirm Log Out
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <Outlet />;
      // Render routed components
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
      <div className="flex h-screen w-full">
        <div className={`${isMobile ? "w-full" : "w-1/5"} bg-gray-800 p-4`}>
          <h2 className="mb-6 text-center text-3xl font-bold text-blue-500">
            Menu
          </h2>
          <hr className="mb-4 border-white" />
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab)}
                className={`flex w-full items-center rounded-lg px-4 py-3 text-left text-lg transition duration-300 ease-in-out ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <tab.icon className="mr-3 text-2xl" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div
          className={`${isMobile ? "w-full" : "w-4/5"} overflow-y-auto bg-gray-900 p-4`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
