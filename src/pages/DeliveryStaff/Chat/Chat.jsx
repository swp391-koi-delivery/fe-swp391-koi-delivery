import React, { useState, useRef, useEffect } from "react";
import axios from "axios"; // Import Axios
import {
  FaPaperPlane,
  FaImage,
  FaSmile,
  FaEllipsisV,
  FaPhoneAlt,
  FaVideo,
  FaUser,
  FaTruck,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaClipboardList,
  FaStar,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../config/axios";

const MainComponent = (token) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "sales", content: "Hi, how's the delivery going?", timestamp: "10:30 AM" },
    { id: 2, sender: "delivery", content: "Hey! It's going well. I'm about 15 minutes away from the next drop-off.", timestamp: "10:32 AM" },
    { id: 3, sender: "customer", content: "Excited about my package! Can't wait to receive it.", timestamp: "10:33 AM" },
    { id: 4, sender: "delivery", content: "Great! I'll make sure to provide excellent service.", timestamp: "10:35 AM" }
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeChat, setActiveChat] = useState("delivery");
  const [userRole, setUserRole] = useState(null); // State to store user role
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Fetch user role when the component mounts
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming the token is stored in local storage
        const response = await api.get(`customer/profile`, {
          headers: {
            Authorization: `Bearer ${token}` // Include Bearer token in the header
          }
        });
        setUserRole(response.data.role); // Assuming the response contains a field 'role'
        setActiveChat(response.data.role === "DELIVERING_STAFF" ? "SALE_STAFF" : "CUSTOMER");
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, [token]); // Empty dependency array to run only once on mount

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "" || selectedImage) {
      const newMsg = {
        id: messages.length + 1,
        sender: "delivery",
        content: newMessage,
        image: selectedImage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
      setSelectedImage(null);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const ChatHeader = () => (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex justify-between items-center rounded-t-xl">
      <div className="flex items-center space-x-3">
        <img
          src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
          alt="Delivery Staff"
          className="w-12 h-12 rounded-full object-cover border-2 border-white"
        />
        <div>
          <h2 className="font-semibold text-lg">Delivery Staff</h2>
          <p className="text-xs text-blue-200">Online</p>
        </div>
      </div>
      <div className="flex space-x-4">
        {[FaPhoneAlt, FaVideo, FaEllipsisV].map((Icon, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="text-black hover:text-blue-200 transition-colors duration-300"
          >
            <Icon />
          </motion.button>
        ))}
      </div>
    </div>
  );

  const ChatBubble = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`flex ${message.sender === "delivery" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg ${message.sender === "delivery" ? "bg-blue-500 text-black" : message.sender === "customer" ? "bg-green-500 text-black" : "bg-gray-200 text-black"} rounded-lg p-3 shadow-md`}
      >
        {message.image && (
          <img
            src={message.image}
            alt="Uploaded"
            className="max-w-full h-auto rounded-lg mb-2"
          />
        )}
        <p>{message.content}</p>
        <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
      </div>
    </motion.div>
  );

  const ChatInput = () => (
    <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
      <div className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-black"
        />
        {[FaImage, FaSmile, FaBoxOpen, FaMapMarkerAlt].map((Icon, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={Icon === FaImage ? () => fileInputRef.current.click() : null}
            className="bg-gray-200 hover:bg-gray-300 text-black rounded-full p-3 transition-all duration-300"
          >
            <Icon />
          </motion.button>
        ))}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 transition-all duration-300"
        >
          <FaPaperPlane />
        </motion.button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      {selectedImage && (
        <div className="mt-2">
          <img
            src={selectedImage}
            alt="Selected"
            className="max-w-xs h-auto rounded-lg"
          />
        </div>
      )}
    </div>
  );

  const Sidebar = () => {
    const chatOptions = userRole === "DELIVERING_STAFF" 
      ? ["SALE_STAFF", "CUSTOMER"] 
      : ["DELIVERING_STAFF", "SALE_STAFF", "CUSTOMER"];

    return (
      <div className="bg-gray-100 w-64 p-4 rounded-l-xl">
        <h2 className="text-xl font-semibold mb-4 text-black">Chats</h2>
        {chatOptions.map((chat) => (
          <motion.div
            key={chat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveChat(chat)}
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${activeChat === chat ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
          >
            <div className="text-2xl text-black">
              {chat === "delivery" ? <FaTruck /> : chat === "customer" ? <FaUser /> : <FaClipboardList />}
            </div>
            <div className="text-black font-semibold">{chat}</div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-white flex flex-col">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto p-4" ref={chatContainerRef}>
          <AnimatePresence>
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
          </AnimatePresence>
        </div>
        <ChatInput />
      </div>
    </div>
  );
};

export default MainComponent;
