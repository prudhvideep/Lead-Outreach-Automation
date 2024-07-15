import React from "react";

const Circle = ({label}) => {
  return( 
  <div className="flex items-center justify-center bg-white-50 w-16 h-16 text-center border-2 border-gray-200 hover:border-gray-400 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105">
     <h1 className="p-4 mt-1 text-gray-600 font-medium">{label}</h1>
  </div>
  );
};

export default Circle;
