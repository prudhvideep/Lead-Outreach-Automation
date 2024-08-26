import React from "react";
import { Handle, Position } from "reactflow";
import { FaGripLines } from "react-icons/fa";

function StartNode({ data, selected }) {
  return (
    <>
      <div
        className={`relative p-2 flex flex-row items-center justify-center space-x-2 text-center font-medium  bg-green-900 rounded-xl transition-all duration-200 ease-in-out transform hover:scale-105 ${
          selected ? "outline outline-offset-1 outline-blue-700" : ""
        }`}
      > 
        < FaGripLines className="text-gray-500"/>
        <p >Start</p>
      </div>
      <Handle
        id="b"
        type="source"
        position={Position.Right}
        className="absolute -right-[15px] top-1/2 w-3 h-3 rounded-full bg-gray-700 border border-gray-500"
      />
    </>
  );
}

export default StartNode;
