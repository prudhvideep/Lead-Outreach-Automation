import React, { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { HiVariable } from "react-icons/hi2";
import { TbMathFunction } from "react-icons/tb";
import { FiClock } from 'react-icons/fi';


export default function UpdateNode({
  selectedNode,
  setNodeInfo,
  nodeInfoVar,
  setNodeInfoVar,
  nodeVariables,
  setNodeVariables,
  setNodes,
  setSelectedElements,
  handleDelete,
}) {
  const [addVariable, setAddVariable] = useState(false);
  const [editVariable, setEditVariable] = useState(false);
  const [variable, setVariable] = useState({ name: "", value: "" });
  const [waitTime, setWaitTime] = useState(nodeVariables.waitTime || "");

  // Process the text to replace the variables with values
  const processText = (text) => {
    let processedText = text;
    Object.entries(nodeVariables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{${key}\\}`, "g");
      processedText = processedText.replace(regex, value);
    });
    return processedText;
  };

  const handleInfoChange = (event) => {
    const newText = event.target.value;
    setNodeInfoVar(newText);
    setNodeInfo(processText(newText));
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
    let updatedVariables = {
      ...nodeVariables,
      [variable.name]: variable.value,
    };
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
    setVariable({ name: "", value: "" });
    setAddVariable(false);
  };

  const handleEditVariable = () => {
    let updatedVariables = {
      ...nodeVariables,
      [variable.name]: variable.value,
    };
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
    setEditVariable(false);
    setVariable({ name: "", value: "" });
  };

  const handleVariableNameChange = (event) => {
    setVariable((prev) => ({ ...prev, name: event.target.value }));
  };

  const handleVariableValueChange = (event) => {
    setVariable((prev) => ({ ...prev, value: event.target.value }));
  };

  const handleWaitTimeChange = (event) => {
    setWaitTime(event.target.value);
    setNodeVariables({ ...nodeVariables, waitTime: event.target.value });
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              variables: {
                ...node.data.variables,
                waitTime: event.target.value,
              },
            },
          };
        }
        return node;
      })
    );
  };

  return (
    <div>
      <h3 className="text-xl mb-4 text-gray-800 font-semibold">Update Node</h3>
      <div className="p-4 space-y-4 border-gray-200 border-2 rounded-xl hover:border-gray-400 bg-white">
        <p className="font-medium text-gray-800">Node Data</p>
        <textarea
          type="text"
          className="block w-full pt-2 px-3 pb-3 overflow-y-auto text-gray-700 border border-gray-400 rounded-lg bg-white-500 break-words focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          value={nodeInfoVar}
          onChange={(event) => {
            handleInfoChange(event);
          }}
          placeholder="Add text and {variables}"
          style={{ height: "160px" }}
        />
      </div>
      <div className="relative p-4 mt-6 space-y-4 border-gray-200 border-2 rounded-xl hover:border-gray-400 bg-white">
        <p className="font-medium text-gray-800">Wait Time</p>
        <FiClock
          className="absolute inset-y-1 right-5" 
        />
        <input
          type="number"
          className="block w-full pt-2 px-3 pb-3 text-gray-700 border border-gray-400 rounded-lg bg-white-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          value={waitTime}
          onChange={handleWaitTimeChange}
          placeholder="Wait time in sec"
        />
      </div>
      <div className="mt-6 p-4 space-y-4 border-gray-200 border-2 rounded-xl hover:border-gray-400">
        <p className="font-medium w-auto h-auto text-gray-800">Variables</p>
        {Object.keys(nodeVariables).length > 0 && (
          <div className="relative space-y-2 bg-inherit rounded-lg w-full">
            {Object.entries(nodeVariables).map(([key, value]) => (
              <div key={key} className="relative flex items-center">
                <h1
                  onClick={() => {
                    setAddVariable(false);
                    setEditVariable(true);
                    setVariable({
                      name: key,
                      value: value,
                    });
                  }}
                  className="underline text-indigo-600 italic hover:text-indigo-800 flex-grow cursor-pointer"
                >
                  {key}
                </h1>
                <FaTrashAlt
                  id={key}
                  className="text-gray-500 hover:text-red-500 ml-2 cursor-pointer"
                  onClick={() => handleDeleteVariable(key)}
                />
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-col justify-center">
          <button
            className={`bg-white font-semibold border rounded-md border-dashed p-1 ${
              addVariable || editVariable
                ? "border-gray-600 text-gray-600 cursor-not-allowed"
                : "border-blue-500 text-blue-500 hover:bg-blue-50"
            }`}
            disabled={addVariable || editVariable}
            onClick={() => {
              setAddVariable(true);
              setVariable({ name: "", value: "" });
            }}
          >
            New Variable +
          </button>
        </div>
      </div>
      {(addVariable || editVariable) && (
        <div className="mt-6 p-4 space-y-4 border-gray-200 border-2 rounded-xl hover:border-gray-400">
          <p className="font-medium w-auto h-auto text-gray-800">
            {editVariable ? "Edit Variable" : "Add Variable"}
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
              className={`mt-1 block w-full p-1 px-3 text-gray-700 border border-gray-300 rounded-lg break-words focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                editVariable ? "bg-gray-100" : ""
              }`}
              disabled={editVariable}
              value={variable.name}
              onChange={handleVariableNameChange}
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
              className="mt-1 block w-full p-1 px-3 text-gray-700 border border-gray-
              300 rounded-lg break-words focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={variable.value}
              onChange={handleVariableValueChange}
            />
          </div>
          <div className="mt-2 flex p-1 space-x-2 rounded-xl">
            {addVariable && (
              <button
                className="bg-purple-500 text-white rounded-lg p-1 w-1/2 hover:bg-purple-600 transition-all duration-200 ease-in-out transform hover:scale-105"
                onClick={handleCreateVariable}
              >
                Create
              </button>
            )}
            {editVariable && (
              <button
                className="bg-purple-500 text-white rounded-lg p-1 w-1/2 hover:bg-purple-600 transition-all duration-200 ease-in-out transform hover:scale-105"
                onClick={handleEditVariable}
              >
                Save
              </button>
            )}
            <button
              className="bg-slate-400 text-white rounded-lg p-1 w-1/2 hover:bg-slate-500 transition-all duration-200 ease-in-out transform hover:scale-105"
              onClick={() => {
                setAddVariable(false);
                setEditVariable(false);
                setVariable({ name: "", value: "" });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="mt-4 flex p-4 space-x-2 rounded-xl">
        <button
          className="bg-blue-500 text-white rounded-lg p-2 w-1/2 hover:bg-blue-600 transition-all duration-200 ease-in-out transform hover:scale-105"
          onClick={() => {
            setSelectedElements([])
          }}
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
  );
}
