import React from "react";
import { Handle, Position } from "reactflow";
import { IoStopOutline } from "react-icons/io5";

function EndNode({ data, selected }) {
  return (
    <>
      <div
        className={`relative shadow-xl flex items-center justify-center bg-white w-10 h-10 text-center bg-red-10 border border-red-500 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 ${
          selected ? "border-solid border-2 border-red-500" : ""
        }`}
      >
         <IoStopOutline
          className={`${
            selected ? "text-red-600 text-2xl" : "text-red-500 text-2xl"
          }`}
        />
      </div>
      <Handle
        id="a"
        type="target"
        position={Position.Left}
        className="w-2 h-2 rounded-full bg-slate-500"
      />
    </>
  );
}

export default EndNode;
