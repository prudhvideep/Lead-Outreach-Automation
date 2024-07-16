import React from "react";


export default function UpdateStartOrEndNode({
  selectedNode,
  setSelectedElements,
  handleDelete,
}) {
  return (
    <div>
      <h3 className="text-xl mb-4 text-gray-800 font-semibold">Actions</h3>
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
