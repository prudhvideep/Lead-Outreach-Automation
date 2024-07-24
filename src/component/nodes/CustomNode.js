import React, { useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import {
  FaWhatsapp,
  FaCommentDots,
  FaEnvelope,
  FaRobot,
  FaUserTie,
  FaPhoneAlt,
} from "react-icons/fa";

function CustomNode({ data, selected, id }) {
  const nodeTypes = {
    message: {
      icon: <FaCommentDots />,
      label: "SMS",
      bgColor: "bg-indigo-300",
    },
    whatsapp: {
      icon: <FaWhatsapp />,
      label: "WhatsApp",
      bgColor: "bg-green-300",
    },
    botCall: {
      icon: <FaRobot />,
      label: "Bot Call",
      bgColor: "bg-purple-300",
    },
    email: { icon: <FaEnvelope />, label: "Email", bgColor: "bg-orange-300" },
    fieldAgent: {
      icon: <FaUserTie />,
      label: "Field Agent",
      bgColor: "bg-red-300",
    },
    teleCall: {
      icon: <FaPhoneAlt />,
      label: "Tele Call",
      bgColor: "bg-stone-300",
    },
  };

  const getStatusOptions = (nodeType) => {
    switch (nodeType) {
      case "sms":
        return ["Delivered", "Failed"];
      case "whatsapp":
        return ["Delivered", "Read", "Failed"];
      case "email":
        return ["Sent", "Failed"];
      case "botCall":
      case "teleCall":
        return ["Answered", "Wrong Number", "No Response"];
      case "wait":
        return ["Received", "Not Received"];
      case "fieldAgent":
        return ["Assigned", "Pending", "Completed"];
      default:
        return ["status"];
    }
  };

  const options = getStatusOptions(data.nodeType);

  const { icon, label, bgColor } =
    nodeTypes[data.nodeType] || nodeTypes.message;

  const [hideStatus, setHideStatus] = useState(false);
  const [animateStatus, setAnimateStatus] = useState(false);

  useEffect(() => {
    if (!hideStatus) {
      setTimeout(() => setAnimateStatus(true), 50);
    }
  }, [hideStatus]);

  const handleNodeClick = (status) => {
    setAnimateStatus(false);
    setTimeout(() => setHideStatus(true), 300);
    if(data.onStatusChange){
      data.onStatusChange(id,status,data.position,data.nodeType);
    }
  };

  return (
    <div
      className={`relative w-40 shadow-xl rounded-md bg-white ${
        selected ? "border-solid border-2 rounded-lg border-indigo-500" : ""
      }`}
    >
      <div className="flex flex-col border rounded-md shadow-lg overflow-hidden bg-white transition-all duration-200">
        <div
          className={`flex justify-center items-center max-h-max px-2 py-1 text-center text-black text-xs font-bold rounded-t-md ${bgColor}`}
        >
          <div className="mr-1">{icon}</div>
          <div className="">{label}</div>
        </div>
        <div className={`px-3 py-2 space-x-1 break-words`}>
          <div
            className="text-xs font-normal text-slate-500 bg-inherit"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {data.info || "Click to Edit //"}
          </div>
        </div>
      </div>

    
        <>
          <Handle
            id="a"
            type="target"
            position={Position.Left}
            className="w-2 h-2 rounded-full bg-slate-500"
          />
          <Handle
            id="b"
            type="source"
            position={Position.Right}
            className="w-2 h-2 rounded-full bg-gray-500"
          />
        </>
      
      {!hideStatus && (
        <div className="absolute -inset-y-4 left-48 bg-black-200 w-10 h-10 flex flex-col space-y-4">
          {options.map((status, index) => (
            <div
              key={`${index}`}
              className={`
                p-1 w-24 rounded-md text-center bg-gray-100 text-wrap 
                hover:cursor-pointer hover:border hover:border-gray-600 hover:scale-105 
                text-gray-500 hover:text-gray-600 
                transition-all duration-300 ease-in-out
                transform ${
                  animateStatus
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
                }
              `}
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => handleNodeClick(status)}
            >
              <p className="">{status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomNode;
