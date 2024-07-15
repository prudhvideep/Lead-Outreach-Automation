import React from "react";

const Rhombus = ({ label }) => {
  return (
    <div className="ml-4  relative rounded-lg flex items-center justify-center w-14 h-14 bg-white-50 border-2 border-gray-200 hover:border-gray-400 transform rotate-45 transition-all duration-200 ease-in-out transform hover:scale-105">
      <h1 className="absolute transform -rotate-45 text-gray-600 font-medium">{label}</h1>
    </div>
  );
};

export default Rhombus;
