import React from "react";
import { Handle, Position } from "reactflow";

function EndNode({ data, selected }) {
  return (
    <>
      <div
        className={`relative shadow-xl flex items-center justify-center bg-white w-16 h-16 text-center border-2 border-gray-200 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 ${
          selected ? "border-solid border-2 border-indigo-500" : ""
        }`}
      >
        <h1 className="text-gray-600 font-medium">End</h1>
      </div>
      <Handle
        id="a"
        type="target"
        position={Position.Left}
        className="w-1 rounded-full bg-slate-500"
      />
    </>
  );
}

export default EndNode;
