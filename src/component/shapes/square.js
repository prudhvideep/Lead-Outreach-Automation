import React from "react";

const Square = ({ label }) => {
  return (
    <div className="ml-4 pb-2 relative rounded-lg flex items-center justify-center w-16 h-16 bg-white-50 border-2 border-gray-200 hover:border-gray-400 transition-all duration-200 ease-in-out transform hover:scale-105">
      <h1 className="text-gray-600 font-medium">{label}</h1>
    </div>
  );
};

export default Square;
