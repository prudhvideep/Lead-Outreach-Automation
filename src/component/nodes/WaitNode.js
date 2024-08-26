import React from "react";
import { Handle, Position } from "reactflow";
import { FiClock } from 'react-icons/fi';


function WaitNode({ data, selected }) {
  return (
    <>
      <div
        className={`relative shadow-xl flex items-center justify-center w-20 h-20 text-center bg-gray-700  rounded-lg border border-gray-800 transition-all duration-200 ease-in-out transform hover:scale-105 ${
          selected ? "outline outline-offset-1 outline-blue-700" : ""
        }`}
      >
        <FiClock 
          className="text-yellow-700 text-4xl"
        />
      </div>

      <Handle
        id="a"
        type="target"
        position={Position.Left}
        className="w-3 h-3 -left-[15px] top-1/2 rounded-full bg-gray-700 border border-gray-500"
      />
      <Handle
        id="b"
        type="source"
        position={Position.Right}
        className="w-3 h-3 -right-[15px] top-1/2 rounded-full bg-gray-700 border border-gray-500"
      />
    </>
  );
}

export default WaitNode;
