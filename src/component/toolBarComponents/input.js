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
        className={`block ml-1 py-1.5 pl-4 pr-8 h-10 border-2 text-lg rounded-xl shadow-sm font-medium
          ${
            editable
              ? "border-gray-400 text-black bg-white hover:border-gray-600"
              : "border-gray-300 text-gray-600 bg-gray-50 cursor-not-allowed"
          }`}
      />
      <div className="absolute inset-y-1 right-2 flex items-center">
        {!editable && (
          <FaPen
            onClick={() => setEditable(true)}
            className="text-gray-500 hover:text-indigo-500 hover:scale-110 font-thin text-md cursor-pointer"
          />
        )}
        {editable && (
          <MdOutlineDone
            onClick={() => setEditable(false)}
            className="text-gray-500 hover:text-indigo-500 hover:scale-110 font-thin text-2xl cursor-pointer"
          />
        )}
      </div>
    </>
  );
}

export default Input;