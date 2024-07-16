import React, { useState } from "react";
import { FiClock } from 'react-icons/fi';


export default function UpdateDelay({
  selectedNode,
  nodeVariables,
  setNodeVariables,
  setNodes,
  setSelectedElements,
  handleDelete,
}) {
  const [waitTime, setWaitTime] = useState(nodeVariables.waitTime || "");

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
      <h3 className="text-xl mb-4 text-gray-800 font-semibold">Update Delay</h3>
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
