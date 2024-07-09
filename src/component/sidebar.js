"use client";

import React, { useState, useEffect } from "react";
import {
  FaWhatsapp,
  FaEnvelope,
  FaCommentDots,
  FaRobot,
  FaPhoneAlt,
  FaUserTie,
  FaTrashAlt,
} from "react-icons/fa";
import { HiVariable } from "react-icons/hi2";
import { TbMathFunction } from "react-icons/tb";
import { FiSidebar } from "react-icons/fi";

const icons = {
  sms: <FaCommentDots />,
  whatsapp: <FaWhatsapp />,
  botCall: <FaRobot />,
  email: <FaEnvelope />,
};

const manualIcons = {
  fieldAgent: <FaUserTie />,
  teleCall: <FaPhoneAlt />,
};

export default function Sidebar({
  nodes,
  setNodes,
  edges,
  setEdges,
  nodeName,
  setNodeName,
  nodeInfo,
  setNodeInfo,
  nodeVariables,
  setNodeVariables,
  selectedNode,
  setSelectedElements,
}) {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [newVariable, setNewVariable] = useState({ name: "", value: "" });
  const [addVariable, setAddVariable] = useState(false);
  const [textareaHeights, setTextareaHeights] = useState({});
  const [sidebarExpand, setSidebarExpand] = useState(true); 

  const handleInfoChange = (event) => {
    setNodeInfo(event.target.value);
  };

  const adjustTextareaHeight = (event, nodeId) => {
    const textarea = event.target;
    const maxHeight = 150;

    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;

    setTextareaHeights((prevHeights) => ({
      ...prevHeights,
      [nodeId]: newHeight,
    }));
  };

  useEffect(() => {
    if (selectedNode) {
      const savedHeight = textareaHeights[selectedNode.id];
      if (savedHeight) {
        const textarea = document.querySelector("textarea");
        if (textarea) {
          textarea.style.height = `${savedHeight}px`;
        }
      }
    }
  }, [selectedNode, textareaHeights]);

  const onDragStart = (event, type, nodeActionType) => {
    const nodeObj = {
      type : type,
      nodeActionType : nodeActionType
    }
    event.dataTransfer.setData("application/reactflow", JSON.stringify(nodeObj));
    event.dataTransfer.effectAllowed = "move";
    setDragging(true);
  };

  const onDragEnd = () => {
    setDragging(false);
  };

  const handleDeleteVariable = (key) => {
    const updatedVariables = { ...nodeVariables };
    delete updatedVariables[key];
    setNodeVariables(updatedVariables);

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              variables: updatedVariables,
            },
          };
        }
        return node;
      })
    );
  };

  const handleCreateVariable = () => {
    let updatedVariables = nodeVariables;
    updatedVariables[newVariable.name] = newVariable.value;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              variables: updatedVariables,
            },
          };
        }
        return node;
      })
    );
    setNewVariable({ name: "", value: "" });
    setAddVariable(false);
  };

  const handleDelete = (nodeId) => {
    const updatedNodes = nodes.filter((node) => node?.id !== nodeId);
    setNodes(updatedNodes);
    setSelectedElements([]);
  };

  const handleCancel = (event) => {
    setAddVariable(false);
    setNewVariable({ name: "", value: "" });
  };

  const handleVariableNameChange = (event) => {
    setNewVariable((prevValue) => ({
      ...prevValue,
      name: event.target.value,
    }));
  };

  const handleVariableValueChange = (event) => {
    setNewVariable((prevValue) => ({
      ...prevValue,
      value: event.target.value,
    }));
  };

  const autoNodeTypes = [
    { type: "sms", label: "SMS", nodeActionType: "automatic", color: "indigo", shade: "400" },
    { type: "whatsapp", label: "WhatsApp", nodeActionType: "automatic", color: "green", shade: "500" },
    { type: "botCall", label: "Bot Call", nodeActionType: "automatic", color: "purple", shade: "500" },
    { type: "email", label: "Email", nodeActionType: "automatic", color: "orange", shade: "500" },
  ];

  const manualNodeTypes = [
    { type: "fieldAgent", label: "Field Agent", nodeActionType: "manual", color: "red", shade: "500" },
    { type: "teleCall", label: "Tele Call", nodeActionType: "manual", color: "stone", shade: "500" },
  ];

  return (
    <aside className={`transition-all duration-300 ease-in-out border-r-2 border-gray-400 p-4 text-sm bg-gradient-to-b from-gray-50 to-white h-screen text-gray-800 shadow-lg overflow-y-auto ${
      sidebarExpand ? "w-64" : "w-14"
    }`}>
      {(sidebarExpand && selectedNode) ? (
        // settings panel
        <div>
          <h3 className="text-xl mb-4 text-gray-800 font-semibold">
            Update Node
          </h3>
          <div className="p-4 space-y-4 border-gray-200 border-2 rounded-xl hover:border-gray-400 bg-white">
            <p className="font-medium text-gray-800">Node Data</p>
            <textarea
              type="text"
              className="block w-full pt-2 px-3 pb-3 overflow-y-auto text-gray-700 border border-gray-400 rounded-lg bg-white-500 break-words focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={nodeInfo}
              onChange={(event) => {
                handleInfoChange(event);
                adjustTextareaHeight(event, selectedNode.id);
              }}
              placeholder="// Add data"
              style={{ height: textareaHeights[selectedNode.id] || "auto" }}
            />
          </div>
          <div className="mt-6 p-4 space-y-4 border-gray-200 border-2 rounded-xl hover:border-gray-400">
            <p className="font-medium w-auto h-auto text-gray-800">Variables</p>
            {Object.keys(nodeVariables).length > 0 && (
              <>
                <div className="space-y-2 bg-inherit rounded-lg w-full">
                  {Object.entries(nodeVariables).map(([key, value]) => (
                    <details key={key} className="group">
                      <summary className="ml-2 cursor-pointer font-semibold text-blue-500 hover:text-blue-800  focus:outline-none transition duration-200 ease-in-out flex items-center">
                        <span className="hover:scale-105 underline flex-grow break-words">
                          {key}
                        </span>
                        <FaTrashAlt
                          className="text-gray-500 hover:text-red-500 ml-2 cursor-pointer"
                          onClick={() => handleDeleteVariable(key)}
                        />
                      </summary>
                      <div className="ml-2 mt-2 text-gray-700 font-medium text-sm break-words">
                        {value}
                      </div>
                    </details>
                  ))}
                </div>
              </>
            )}
            <div className="flex flex-col justify-center">
              <button
                className={`bg-white font-semibold border rounded-md border-dashed p-1 ${
                  addVariable
                    ? "border-gray-600 text-gray-600"
                    : "border-blue-500 text-blue-500"
                }`}
                disabled={addVariable}
                onClick={() => {
                  setAddVariable(true);
                }}
              >
                New Variable +
              </button>
            </div>
          </div>
          {addVariable && (
            <div className="mt-6 p-4 space-y-4 border-gray-200 border-2 rounded-xl hover:border-gray-400 ">
              <p className="font-medium w-auto h-auto text-gray-800">
                Add Variable
              </p>
              <div>
                <div className="flex flex-row space-x-1">
                  <p className="w-auto h-auto text-slate-500 flex flex-row">
                    Variable Name
                  </p>
                  <span className="mt-auto mb-auto">
                    <HiVariable />
                  </span>
                </div>
                <input
                  className="mt-1 block w-full p-1 px-3 text-gray-700 border border-gray-300 rounded-lg bg-gray-50 break-words focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={newVariable.name}
                  onChange={(event) => {
                    handleVariableNameChange(event);
                  }}
                />
              </div>
              <div>
                <div className="flex flex-row space-x-1">
                  <p className="w-auto h-auto text-slate-500 flex flex-row">
                    Value{" "}
                  </p>
                  <span className="mt-auto mb-auto">
                    <TbMathFunction />
                  </span>
                </div>
                <input
                  className="mt-1 block w-full p-1 px-3 text-gray-700 border border-gray-300 rounded-lg bg-gray-50 break-words focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={newVariable.value}
                  onChange={(event) => {
                    handleVariableValueChange(event);
                  }}
                />
              </div>
              <div className="mt-2 flex p-1 space-x-2 rounded-xl">
                <button
                  className="bg-purple-500 text-white rounded-lg p-1 w-1/2 hover:bg-purple-600 transition-all duration-200 ease-in-out transform hover:scale-105"
                  onClick={handleCreateVariable}
                >
                  Create
                </button>
                <button
                  className="bg-slate-400 text-white rounded-lg p-1 w-1/2 hover:bg-slate-500 transition-all duration-200 ease-in-out transform hover:scale-105"
                  onClick={(event) => handleCancel(event)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          <div className="mt-4 flex p-4 space-x-2 rounded-xl">
            <button
              className="bg-blue-500 text-white rounded-lg p-2 w-1/2 hover:bg-blue-600 transition-all duration-200 ease-in-out transform hover:scale-105"
              onClick={() => setSelectedElements([])}
            >
              Save
            </button>
            <button
              className="bg-red-400 text-white rounded-lg p-2 w-1/2 hover:bg-red-500 transition-all duration-200 ease-in-out transform hover:scale-105"
              onClick={() => handleDelete(selectedNode?.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        // node panel
        <>
          <div className={`flex flex-row ${sidebarExpand && "space-x-32"}`}>
            <h3 className={`text-xl mb-4 ${!sidebarExpand && "hidden"} text-gray-800 font-semibold`}>
              Actions
            </h3>
            < FiSidebar
              className={`text-xl mt-1.5 text-gray-500 hover:text-gray-900 hover:scale-110 ${!sidebarExpand && "size-32"}`}
              onClick={() => setSidebarExpand(!sidebarExpand)}
            />
          </div>
          <div className={`p-5 space-y-4 border-gray-200 border-2 rounded-xl hover:border-gray-400  ${!sidebarExpand && "hidden"}`}>
            <p className="font-medium text-slate-500">Automatic</p>
            {autoNodeTypes.map((node) => (
              <div
                key={node.type}
                className={`relative bg-white p-4 border-2 border-gray-200 rounded-lg cursor-${
                  dragging ? "grabbing" : "grab"
                } flex items-center space-x-3 text-gray-600 hover:bg-gray-50 hover:border-${
                  node.color
                }-${node.shade} hover:text-${node.color}-${
                  node.shade
                } transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-md`}
                onDragStart={(event) => onDragStart(event, node.type, node.nodeActionType)}
                onDragEnd={onDragEnd}
                draggable
                onMouseEnter={() => setHoveredNode(node.type)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div
                  className={`text-gray-400 group-hover:text-blue-500 transition-colors duration-200 text-${node.color}-${node.shade}`}
                >
                  {icons[node.type]}
                </div>
                <span className="font-medium">{node.label}</span>
                {hoveredNode === node.type && !dragging && (
                  <div className="absolute top-0 right-2 transform -translate-y-1/2 mt-0 px-2 py-1 bg-gray-600 text-white font-semibold text-xs rounded-md transition-opacity duration-200 ease-in-out group-hover:opacity-100 group-active:opacity-0 group-active:pointer-events-none">
                    Drag to add
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className={`p-5 mt-4 space-y-4 border-gray-200 border-2 rounded-xl hover:border-gray-400 ${!sidebarExpand && "hidden"}`}>
            <p className="font-medium text-slate-500">Manual</p>
            {manualNodeTypes.map((node) => (
              <div
                key={node.type}
                className={`relative bg-white p-4 border-2 border-gray-200 rounded-lg cursor-${
                  dragging ? "grabbing" : "grab"
                } flex items-center space-x-3 text-gray-600 hover:bg-gray-50 hover:border-${
                  node.color
                }-${node.shade} hover:text-${node.color}-${
                  node.shade
                } transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-md`}
                onDragStart={(event) => onDragStart(event, node.type, node.nodeActionType)}
                onDragEnd={onDragEnd}
                draggable
                onMouseEnter={() => setHoveredNode(node.type)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div
                  className={`text-gray-400 group-hover:text-blue-500 transition-colors duration-200 text-${node.color}-${node.shade}`}
                >
                  {manualIcons[node.type]}
                </div>
                <span className="font-medium">{node.label}</span>
                {hoveredNode === node.type && !dragging && (
                  <div className="absolute top-0 right-2 transform -translate-y-1/2 mt-0 px-2 py-1 bg-gray-600 text-white text-xs rounded-md transition-opacity duration-200 ease-in-out group-hover:opacity-100">
                    Drag to add
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </aside>
  );
}
