import React from "react";
import { Handle, Position } from "reactflow";

function DecisionNode({ data, selected }) {
  return (
    <>
      <div
        className={`relative shadow-xl flex items-center justify-center bg-white w-10 h-10 text-center border border-orange-500  rounded-lg transition-all duration-200 ease-in-out  transform rotate-45 ${
          selected ? "border-solid border-2 border-orange-500" : ""
        }`}
      >
      
      </div>
      <Handle
        type="target"
        id="a"
        position={Position.Top}
        className="w-2 h-2 rounded-full bg-gray-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="yes"
        className="w-2 h-2 rounded-full bg-gray-500 "
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="no"
        className="w-2 h-2 rounded-full bg-gray-500"
      />
      <div className="absolute top-1/2 -right-8 transform -translate-y-1/2">
        <span className="text-xs font-medium text-gray-600">{data.yesLabel || "Yes"}</span>
      </div>
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
        <span className="text-xs font-medium text-gray-600">{data.noLabel || "No"}</span>
      </div>
    </>
  );
}

export default DecisionNode;
