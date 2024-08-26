import React from "react";


export default function UpdateStartOrEndNode({
  selectedNode,
  setSelectedElements,
  handleDelete,
}) {
  return (
    <div>
      <h3 className="text-md mb-4 text-gray-300 font-medium">Actions</h3>
      <div className="w-full mt-4 flex flex-row p-4 space-x-6 rounded-xl">
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
