import React, { useState, useEffect, useRef } from "react";
import { Handle, Position } from "reactflow";
import {
  FaWhatsapp,
  FaCommentDots,
  FaEnvelope,
  FaRobot,
  FaUserTie,
  FaPhoneAlt,
} from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { FiEdit } from 'react-icons/fi';

function CustomNode({ data, selected, id }) {
  const nodeTypes = {
    message: {
      icon: <FaCommentDots />,
      label: "SMS",
      bgColor: "bg-indigo-700",
    },
    whatsapp: {
      icon: <FaWhatsapp />,
      label: "WhatsApp",
      bgColor: "bg-green-700",
    },
    botCall: {
      icon: <FaRobot />,
      label: "Bot Call",
      bgColor: "bg-purple-700",
    },
    email: { icon: <FaEnvelope />, label: "Email", bgColor: "bg-orange-700" },
    fieldAgent: {
      icon: <FaUserTie />,
      label: "Field Agent",
      bgColor: "bg-red-700",
    },
    teleCall: {
      icon: <FaPhoneAlt />,
      label: "Tele Call",
      bgColor: "bg-stone-700",
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

  const nodeRef = useRef(null);
  const [hideStatus, setHideStatus] = useState(false);
  const [animateStatus, setAnimateStatus] = useState(false);

  useEffect(() => {
    if (!hideStatus) {
      setTimeout(() => setAnimateStatus(true), 50);
    }
  }, [hideStatus]);

  useEffect(() => {
    const handleShowStatus = (event) => {
      event.preventDefault();
      setAnimateStatus(true);
      setHideStatus(false);
    };

    if (nodeRef.current) {
      nodeRef.current.addEventListener("contextmenu", handleShowStatus);
    }

    return () => {
      if (nodeRef.current) {
        nodeRef.current.removeEventListener("contextmenu", handleShowStatus);
      }
    };
  }, [hideStatus]);

  const handleNodeClick = (status) => {
    setAnimateStatus(false);
    setTimeout(() => setHideStatus(true), 300);
    if (data.onStatusChange) {
      data.onStatusChange(id, status, data.position, data.nodeType);
    }
  };

  const handleCloseClick = (event) => {
    event.stopPropagation();
    setHideStatus(true);
  };

  return (
    <div
      ref={nodeRef}
      className={`relative w-40 rounded-md ${
        selected ? "outline rounded-lg outline-indigo-500" : ""
      }`}
    >
      <div className="flex flex-col border border-gray-700 rounded-md shadow-lg overflow-hidden transition-all duration-200">
        <div
          className={`flex justify-center items-center max-h-max px-2 py-1 text-center text-white text-xs font-bold rounded-t-md ${bgColor}`}
        >
          <div className="mr-1">{icon}</div>
          <div>{label}</div>
        </div>
        <div className={`px-3 py-2 space-x-1 break-words bg-gray-800`}>
          <div
            className="text-xs font-normal text-gray-300 bg-inherit"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {data.info || (
              <div className="flex items-center text-xs font-normal text-gray-400">
                <FiEdit className="mr-1" />
                <span>Edit content</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <>
        <Handle
          id="a"
          type="target"
          position={Position.Left}
          className="absolute -left-[15px] top-1/2 w-3 h-3 rounded-full bg-gray-700 border border-gray-500"
        />
        <Handle
          id="b"
          type="source"
          position={Position.Right}
          className="absolute -right-[15px] top-1/2 w-3 h-3 rounded-full bg-gray-700 border border-gray-500"
        />
      </>

      {!hideStatus && (
        <div className="absolute -inset-y-6 left-60 w-10 h-10 flex flex-col items-center space-y-4">
          {options.map((status, index) => (
            <div
              key={`${index}`}
              className={`
                p-1 w-24 rounded-md text-center bg-gray-700 text- text-sm
                hover:cursor-pointer hover:border hover:border-gray-500 hover:scale-105 
                text-gray-300 hover:text-white 
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
          <div
            onClick={handleCloseClick}
            className="rounded-full w-4 h-4 outline outline-offset-1 hover:outline-blue-700 outline-gray-300 hover:cursor-pointer"
          >
            <IoCloseSharp className="text-gray-300 hover:text-blue-700 font-bold" />
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomNode;
