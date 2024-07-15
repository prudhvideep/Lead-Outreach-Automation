import React from "react";
import { RiFlowChart } from "react-icons/ri";

function FlowIcon() {
  return (
    <div className="absolute left-0 inset-y-0 p-2 flex items-center border bg-gray-200 border-gray-600 rounded-lg h-10 w-auto">
      <RiFlowChart
        className="text-black-500 font-bold text-xl"
        size={24}
        color="black"
      />
    </div>
  );
}

export default FlowIcon;