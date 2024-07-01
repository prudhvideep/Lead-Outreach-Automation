import React from "react";
import { Handle, Position } from "reactflow";
import {
  FaWhatsapp,
  FaCommentDots,
  FaEnvelope,
  FaRobot,
  FaUserTie,
  FaPhoneAlt,
} from "react-icons/fa";
import { HiVariable } from "react-icons/hi2";

function CustomNode({ data, selected }) {
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
    voiceCall: {
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

  const { icon, label, bgColor } =
    nodeTypes[data.nodeType] || nodeTypes.message;

  return (
    <div
      className={`w-40 shadow-xl rounded-md bg-white ${
        selected ? "border-solid border-2 rounded-md border-indigo-500" : ""
      }`}
    >
      <div className="flex flex-col border rounded-lg shadow-lg overflow-hidden bg-white transition-all duration-200">
        <div
          className={`flex justify-center items-center max-h-max px-2 py-1 text-center text-black text-xs font-bold rounded-t-md ${bgColor}`}
        >
          <div className="mr-1">{icon}</div>
          <div className="">{label}</div>
        </div>
        <div className={`px-3 py-2 space-x-1 break-words`}>
          <div className="text-xs font-normal text-slate-400 bg-inherit">
            {data.info || "Click to Edit ..."}
            <div className="mt-2 p-1 space-y-1">
              {Object.keys(data.variables).length > 0 && (
                <>
                  <p className="font-medium w-auto h-auto text-slate-500">
                    Variables
                  </p>
                  <div>
                    <div className="bg-inherit rounded-lg w-full">
                      {Object.entries(data.variables).map(([key, value]) => (
                        <div className="flex flex-row space-x-1">
                          <HiVariable
                            className="mt-auto" 
                          />
                          <p className="italic">{key}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Handle
        id="a"
        type="target"
        position={Position.Left}
        className="w-1 rounded-full bg-slate-500"
      />
      <Handle
        id="b"
        type="source"
        position={Position.Right}
        className="w-1 rounded-full bg-gray-500"
      />
    </div>
  );
}

export default CustomNode;
