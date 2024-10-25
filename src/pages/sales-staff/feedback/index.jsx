import React, { useState, useEffect } from "react";
import { FaUser, FaStar, FaCalendar, FaReply, FaBriefcase } from "react-icons/fa";
//import axios from 'axios'; // or use fetch
import api from "../../../config/axios";
import { Rate } from "antd";
const FeedbackForm = ({id}) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const [newReply, setNewReply] = useState("");
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
          // date: reply.replyDate.split("T")[0], // Extract date
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

  const handleReplySubmit = async (feedbackId) => {
    if (newReply.trim() === "") return;
  
    try {
      const response = await api.post(`feedBack/${feedbackId}/reply`, {
        replyContent: newReply,  // Assuming the API expects this field
        repliedBy: "Staff Member",  // Adjust this as necessary
        replyDate: new Date().toISOString().split('T')[0],  // Send current date in ISO format
      });
  
      if (response.status === 200) {
        // Update the state with the new reply after successful API call
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.map((feedback) => {
            if (feedback.id === feedbackId) {
              return {
                ...feedback,
                replies: [
                  ...feedback.replies,
                  {
                    id: Date.now(),
                    staffName: "Staff Member", // Replace with actual user data if available
                    date: new Date().toISOString().split("T")[0],
                    content: newReply,
                  },
                ],
              };
            }
            return feedback;
          })
        );
        setNewReply("");  // Clear the input after submitting
      } else {
        console.error("Error submitting reply:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
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
            {expandedFeedback === feedback.id && (
              <div
                id={`feedback-${feedback.id}`}
                className="p-6 bg-gray-100 border-t border-gray-200 animate-fade-in-down"
              >
                <h3 className="font-semibold text-lg mb-4 text-gray-800">
                  {feedback.type === "customer" ? "Sales Staff Reply" : "Management Reply"}
                </h3>
                {feedback.replies.map((reply) => (
                  <div key={reply.id} className="mb-4 last:mb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <FaReply className="text-green-500 mr-2" />
                        <span className="font-medium text-gray-700">{reply.staffName}</span>
                      </div>
                      <span className="text-sm text-gray-500">{reply.date}</span>
                    </div>
                    <p className="text-gray-600 pl-6">{reply.content}</p>
                  </div>
                ))}
                <div className="mt-4">
                  <textarea
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                    rows="3"
                    placeholder="Write your reply..."
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                  ></textarea>
                  <button
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    onClick={() => handleReplySubmit(feedback.id)}
                  >
                    Submit Reply
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackForm;

// import React, { useState } from "react";

// import { FaUser, FaStar, FaCalendar, FaReply, FaBriefcase } from "react-icons/fa";

// const FeedbackForm = () => {
//   const [feedbacks, setFeedbacks] = useState([
//     {
//       id: 1,
//       name: "John Doe",
//       type: "customer",
//       rating: 4,
//       date: "2023-05-15",
//       content: "Great service! Very satisfied with the product.",
//       replies: [
//         {
//           id: 101,
//           staffName: "Jane Smith",
//           date: "2023-05-16",
//           content: "Thank you for your feedback, John! We're glad you enjoyed our service."
//         }
//       ]
//     },
//   ]);

//   const [expandedFeedback, setExpandedFeedback] = useState(null);
//   const [newReply, setNewReply] = useState("");

//   const toggleFeedback = (id) => {
//     setExpandedFeedback(expandedFeedback === id ? null : id);
//   };

//   const handleReplySubmit = (feedbackId) => {
//     if (newReply.trim() === "") return;

//     setFeedbacks(prevFeedbacks =>
//       prevFeedbacks.map(feedback => {
//         if (feedback.id === feedbackId) {
//           return {
//             ...feedback,
//             replies: [
//               ...feedback.replies,
//               {
//                 id: Date.now(),
//                 staffName: "Staff Member",
//                 date: new Date().toISOString().split('T')[0],
//                 content: newReply
//               }
//             ]
//           };
//         }
//         return feedback;
//       })
//     );

//     setNewReply("");
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1">
//         {feedbacks.map((feedback) => (
//           <div
//             key={feedback.id}
//             className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 ${feedback.type === "employee" ? "border-l-4 border-blue-500" : ""}`}
//           >
//             <div
//               className="p-6 cursor-pointer"
//               onClick={() => toggleFeedback(feedback.id)}
//               role="button"
//               tabIndex={0}
//               aria-expanded={expandedFeedback === feedback.id}
//               aria-controls={`feedback-${feedback.id}`}
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center">
//                   {feedback.type === "customer" ? (
//                     <FaUser className="text-blue-500 mr-2" />
//                   ) : (
//                     <FaBriefcase className="text-green-500 mr-2" />
//                   )}
//                   <span className="font-semibold text-gray-800">{feedback.name}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <FaStar className="text-yellow-400 mr-1" />
//                   <span className="text-gray-600">{feedback.rating}</span>
//                 </div>
//               </div>
//               <div className="flex items-center text-sm text-gray-500 mb-2">
//                 <FaCalendar className="mr-2" />
//                 <span>{feedback.date}</span>
//               </div>
//               <p className="text-gray-700">{feedback.content}</p>
//               <span className={`text-xs font-semibold mt-2 inline-block px-2 py-1 rounded ${feedback.type === "customer" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
//                 {feedback.type === "customer" ? "Customer" : "Employee"}
//               </span>
//             </div>
//             {expandedFeedback === feedback.id && (
//               <div
//                 id={`feedback-${feedback.id}`}
//                 className="p-6 bg-gray-100 border-t border-gray-200 animate-fade-in-down"
//               >
//                 <h3 className="font-semibold text-lg mb-4 text-gray-800">
//                   {feedback.type === "customer" ? "Sales Staff Reply" : "Management Reply"}
//                 </h3>
//                 {feedback.replies.map((reply) => (
//                   <div key={reply.id} className="mb-4 last:mb-0">
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="flex items-center">
//                         <FaReply className="text-green-500 mr-2" />
//                         <span className="font-medium text-gray-700">{reply.staffName}</span>
//                       </div>
//                       <span className="text-sm text-gray-500">{reply.date}</span>
//                     </div>
//                     <p className="text-gray-600 pl-6">{reply.content}</p>
//                   </div>
//                 ))}
//                 <div className="mt-4">
//                   <textarea
//                     className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
//                     rows="3"
//                     placeholder="Write your reply..."
//                     value={newReply}
//                     onChange={(e) => setNewReply(e.target.value)}
//                   ></textarea>
//                   <button
//                     className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//                     onClick={() => handleReplySubmit(feedback.id)}
//                   >
//                     Submit Reply
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FeedbackForm;