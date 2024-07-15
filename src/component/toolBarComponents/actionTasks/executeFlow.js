import React from "react";
import { GoGear } from "react-icons/go";

const ExecuteFlow = ({ collapse }) => {
  return (
    <div
      className={`p-2 text-gray-500 border-2 border-gray-500 bg-gray-50 rounded-full hover:text-indigo-500 hover:border-indigo-500 hover:scale-110 transition-all duration-300 ease-in-out  ${
        collapse ? "hidden" : ""
      }`}
      title="Execute Flow"
    >
      <GoGear className="text-xl" />
    </div>
  );
};

export default ExecuteFlow;
