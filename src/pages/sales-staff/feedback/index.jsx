import React, { useState, useEffect } from "react";

import { FaUser, FaStar, FaCalendar, FaReply, FaBriefcase, FaChevronDown } from "react-icons/fa";

//import axios from 'axios'; // or use fetch
import api from "../../../config/axios";
import { Rate } from "antd";
const FeedbackForm = ({id}) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeedbacks = async () => {
    try {
      const response = await api.get(`feedBack/order/${id}/feedbacks`);
      //console.log(response.data);
      const fetchedData = response.data.map((feedback) => ({
        id: feedback.id,
        name: feedback.eachUserResponse.username,
        type: feedback.eachUserResponse.role === "CUSTOMER" ? "customer" : "sales staff",
        rating: feedback.ratingScore,
        date: feedback.createdTime.split("T")[0], // Extract date
        content: feedback.comment,
        replies: feedback.replies.map(reply => ({
          id: reply.id,
          staffName: reply.repliedBy,
          date: reply.replyDate.split("T")[0], // Extract date
          content: reply.replyContent,
        })),
      }));
      setFeedbacks(fetchedData);
      setLoading(false);
    } catch (error) {
      setError("Error fetching feedbacks");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks(); // Call the function on component mount
  }, []);

  const toggleFeedback = (id) => {
    setExpandedFeedback(expandedFeedback === id ? null : id);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1">
        {feedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 ${feedback.type === "employee" ? "border-l-4 border-blue-500" : ""}`}
          >
            <div
              className="p-6 cursor-pointer"
              onClick={() => toggleFeedback(feedback.id)}
              role="button"
              tabIndex={0}
              aria-expanded={expandedFeedback === feedback.id}
              aria-controls={`feedback-${feedback.id}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {feedback.type === "customer" ? (
                    <FaUser className="text-blue-500 mr-2" />
                  ) : (
                    <FaBriefcase className="text-green-500 mr-2" />
                  )}
                  <span className="font-semibold text-gray-800">{feedback.name}</span>
                </div>
                <div className="flex items-center">
                  {/* <FaStar className="text-yellow-400 mr-1" /> */}
                  <span className="text-gray-600"><Rate disabled value={parseInt(feedback.rating)} /></span>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <FaCalendar className="mr-2" />
                <span>{feedback.date}</span>
              </div>
              <p className="text-gray-700" style={{textAlign:"le"}}>{feedback.content}</p>
              <span className={`text-xs font-semibold mt-2 inline-block px-2 py-1 rounded ${feedback.type === "customer" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                {feedback.type === "customer" ? "Customer" : "Employee"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackForm;

