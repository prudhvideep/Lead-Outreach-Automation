import React from "react";
import { FaAngleRight, FaChevronDown } from "react-icons/fa";

const NodeSection = ({ title, nodes, expanded, setExpanded, onDragStart, onDragEnd }) => (
  <div className="p-4 mt-4 bg-gray-100 border rounded-xl">
    <div className="flex items-center space-x-2 mb-4">
      <button onClick={() => setExpanded(!expanded)}>
        {expanded ? <FaChevronDown className="text-gray-600" /> : <FaAngleRight className="text-gray-600" />}
      </button>
      <h3 className="font-medium text-lg text-gray-700">{title}</h3>
    </div>
    
    {expanded && (
      <div className="space-y-3">
        {nodes.map((node) => (
          <div
            key={node.type}
            className={`flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm cursor-grab 
                        hover:shadow-md transition-all duration-200 
                        hover:bg-${node.color}-50 hover:border-${node.color}-${node.shade}`}
            onDragStart={(event) => onDragStart(event, node.type, node.nodeActionType)}
            onDragEnd={onDragEnd}
            draggable
          >
            <div className={`text-${node.color}-${node.shade} text-xl`}>{node.icon}</div>
            <span className="font-medium text-gray-700">{node.label}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default NodeSection;