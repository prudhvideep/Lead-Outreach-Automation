// Sidebar.js
import React, { useState } from "react";
import { FiSidebar } from "react-icons/fi";
import NodeSection from "./sideBarComponents/nodeSection";
import NodeEditor from "./sideBarComponents/nodeEditor";
import { autoNodeTypes, manualNodeTypes, controlNodesTypes } from "./sideBarComponents/nodeTypes";

export default function Sidebar({
  nodes,
  setNodes,
  edges,
  setEdges,
  nodeName,
  setNodeName,
  nodeInfo,
  setNodeInfo,
  nodeInfoVar,
  setNodeInfoVar,
  nodeVariables,
  setNodeVariables,
  nodeExpressions,
  setNodeExpressions,
  selectedNode,
  setSelectedElements,
}) {
  const [sidebarExpand, setSidebarExpand] = useState(true);
  const [autoNodesExpand, setAutoNodesExpand] = useState(false);
  const [manualNodesExpand, setManualNodesExpand] = useState(false);
  const [controlNodesExpand, setControlNodesExpand] = useState(false);

  const onDragStart = (event, type, nodeActionType) => {
    const nodeObj = {
      type: type,
      nodeActionType: nodeActionType,
    };
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(nodeObj)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  const onDragEnd = () => {
    // Any cleanup after drag, if needed
  };

  const handleDelete = (nodeId) => {
    const updatedNodes = nodes.filter((node) => node?.id !== nodeId);
    setNodes(updatedNodes);
    setSelectedElements([]);
  };

  return (
    <aside
      className={`transition-all duration-300 ease-in-out border-r-2 border-gray-400 p-4 text-sm bg-gradient-to-b from-gray-50 to-white h-screen text-gray-800 shadow-lg overflow-y-auto ${
        sidebarExpand ? "w-64" : "w-14"
      }`}
    >
      <div className={`flex flex-row items-center mb-6 ${sidebarExpand && "space-x-4"}`}>
        <FiSidebar
          className={`text-2xl text-gray-500 hover:text-gray-900 hover:scale-110 ${!sidebarExpand && "size-32"}`}
          onClick={() => setSidebarExpand(!sidebarExpand)}
        />
        <h3 className={`text-2xl ${!sidebarExpand && "hidden"} text-gray-800 font-semibold`}>
          Dashboard
        </h3>
      </div>

      {sidebarExpand && selectedNode ? (
        <NodeEditor
          selectedNode={selectedNode}
          nodeInfo={nodeInfo}
          setNodeInfo={setNodeInfo}
          nodeInfoVar={nodeInfoVar}
          setNodeInfoVar={setNodeInfoVar}
          nodeVariables={nodeVariables}
          setNodeVariables={setNodeVariables}
          nodeExpressions={nodeExpressions}
          setNodeExpressions={setNodeExpressions}
          setNodes={setNodes}
          setSelectedElements={setSelectedElements}
          handleDelete={handleDelete}
        />
      ) : sidebarExpand && (
        <>
          <NodeSection 
            title="Automatic Tasks" 
            nodes={autoNodeTypes} 
            expanded={autoNodesExpand} 
            setExpanded={setAutoNodesExpand}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />

          <NodeSection 
            title="Manual Tasks" 
            nodes={manualNodeTypes} 
            expanded={manualNodesExpand} 
            setExpanded={setManualNodesExpand}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />

          <NodeSection 
            title="Controls" 
            nodes={controlNodesTypes} 
            expanded={controlNodesExpand} 
            setExpanded={setControlNodesExpand}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        </>
      )}
    </aside>
  );
}