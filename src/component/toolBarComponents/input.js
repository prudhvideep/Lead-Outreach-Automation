import React, { useState } from "react";
import { FaPen } from "react-icons/fa";
import { MdOutlineDone } from "react-icons/md";

const Input = ({flowName,setFlowName}) => {
  const [editable, setEditable] = useState(false);

  return (
    <>
     <input
        id="flowName"
        name="flowName"
        type="text"
        placeholder="Flow Name"
        disabled={!editable}
        onChange={(event) => {setFlowName(event.target.value)}}
        className={`block mt-[2px] ml-1 py-1.5 pl-4 pr-8 h-8 border rounded-lg text-sm font-normal placeholder-gray-300 placeholder:text-sm focus:outline-none
          ${
            editable
              ? "border-gray-300 text-gray-200 bg-highlightedgray"
              : "border-gray-700 text-gray-400 bg-highlightedgray cursor-not-allowed"
          }`}
      />
      <div className="absolute inset-y-1 right-2 flex items-center">
        {!editable && (
          <FaPen
            onClick={() => setEditable(true)}
            className="text-gray-300 hover:text-gray-500 hover:scale-110 font-thin text-sm cursor-pointer"
          />
        )}
        {editable && (
          <MdOutlineDone
            onClick={() => setEditable(false)}
            className="text-gray-300 hover:text-gray-500 hover:scale-110 font-thin text-lg cursor-pointer"
          />
        )}
      </div>
    </>
  );
}

export default Input;