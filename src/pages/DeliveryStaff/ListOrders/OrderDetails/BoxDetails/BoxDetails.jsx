import { useState } from "react";
import { FaBox, FaArrowRight, FaDollarSign, FaVolumeUp } from "react-icons/fa";
import { MdOutlineCategory } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";

const BoxDetails = () => {
  const [isHovered, setIsHovered] = useState(false);

  const boxData = {
    contributeID: "BOX123456",
    type: "Standard Package",
    volume: "2.5 cubic feet",
    price: "149.99",
    quantity: 5
  };

  return (
    <div 
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-label="Box Details Information"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FaBox className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800">Box Details</h2>
        </div>
        <BsBoxSeam className={`w-6 h-6 text-blue-500 transform transition-transform duration-300 ${isHovered ? "rotate-12" : ""}`} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <FaArrowRight className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Contribute ID</p>
            <p className="font-semibold text-gray-800">{boxData.contributeID}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <MdOutlineCategory className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Type</p>
            <p className="font-semibold text-gray-800">{boxData.type}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <FaVolumeUp className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Volume</p>
            <p className="font-semibold text-gray-800">{boxData.volume}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <FaDollarSign className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Price</p>
            <p className="font-semibold text-gray-800">${boxData.price}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {boxData.quantity}
          </div>
          <div>
            <p className="text-sm text-gray-500">Quantity</p>
            <p className="font-semibold text-gray-800">{boxData.quantity} units</p>
          </div>
        </div>
      </div>

      <button 
        className="mt-6 w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 focus:outline-none transition-colors duration-200"
        aria-label="View More Details"
      >
        View More Details
      </button>
    </div>
  );
};

export default BoxDetails;