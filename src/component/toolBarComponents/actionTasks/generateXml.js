import React from "react";
import { FaCode } from "react-icons/fa";

const GenerateXml = ({ collapse }) => {

  const generateProcessDefinitionKey = () => {
    const randomPart = Math.random().toString(36).substr(2, 8);
    const pid = `process-${randomPart}`;

    return pid;
  };

  

  return (
    <div
      className={`p-2 text-gray-500 border-2 border-gray-500 bg-gray-50 rounded-full hover:text-indigo-500 hover:border-indigo-500 hover:scale-110 transition-all duration-300 ease-in-out  ${
        collapse ? "hidden" : ""
      }`}
      title="Generate XML"
    >
      <FaCode className="text-xl" />
    </div>
  );
};

export default GenerateXml;
