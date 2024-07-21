import React from "react";
import { Handle, Position } from "reactflow";
import { IoPlayOutline } from "react-icons/io5";

function StartNode({ data, selected }) {
  return (
    <>
      <div
        className={`relative shadow-xl flex items-center justify-center bg-white w-10 h-10 text-center bg-green-20 border border-green-600 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 ${
          selected ? "border-solid border-2 border-green-600" : ""
        }`}
      >
        <IoPlayOutline
          className="text-green-600 text-2xl" 
        />
      </div>
      <Handle
        id="b"
        type="source"
        position={Position.Right}
        className="w-1 rounded-full bg-gray-500"
      />
    </>
  );
}

export default StartNode;
