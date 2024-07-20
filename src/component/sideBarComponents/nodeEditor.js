// NodeEditor.js
import React from "react";
import UpdateNode from "./updateAutoOrManualNode";
import UpdateDelay from "./updateWaitNode";
import UpdateStartOrEndNode from "./updateStartOrEndNode";
import UpdateDecisionNode from "./updateDecisionNode";

const NodeEditor = ({
  nodes,
  setNodes,
  edges,
  setEdges,
  selectedNode,
  nodeInfo,
  setNodeInfo,
  nodeInfoVar,
  setNodeInfoVar,
  nodeVariables,
  setNodeVariables,
  nodeExpressions,
  setNodeExpressions,
  setSelectedElements,
  handleDelete,
}) => {
  return (
    <>
      {(selectedNode.nodeActionType === "manual" ||
        selectedNode.nodeActionType === "automatic") && (
        <UpdateNode
          selectedNode={selectedNode}
          setNodeInfo={setNodeInfo}
          nodeInfoVar={nodeInfoVar}
          setNodeInfoVar={setNodeInfoVar}
          nodeVariables={nodeVariables}
          setNodeVariables={setNodeVariables}
          setNodes={setNodes}
          setSelectedElements={setSelectedElements}
          handleDelete={handleDelete}
        />
      )}
      {selectedNode.nodeActionType === "control" &&
        selectedNode.type === "wait" && (
          <UpdateDelay
            selectedNode={selectedNode}
            setNodeInfo={setNodeInfo}
            nodeInfoVar={nodeInfoVar}
            setNodeInfoVar={setNodeInfoVar}
            nodeVariables={nodeVariables}
            setNodeVariables={setNodeVariables}
            setNodes={setNodes}
            setSelectedElements={setSelectedElements}
            handleDelete={handleDelete}
          />
        )}
      {selectedNode.nodeActionType === "control" &&
        (selectedNode.type === "start" || selectedNode.type === "end") && (
          <UpdateStartOrEndNode
            selectedNode={selectedNode}
            setNodeInfo={setNodeInfo}
            nodeInfoVar={nodeInfoVar}
            setNodeInfoVar={setNodeInfoVar}
            nodeVariables={nodeVariables}
            setNodeVariables={setNodeVariables}
            setNodes={setNodes}
            setSelectedElements={setSelectedElements}
            handleDelete={handleDelete}
          />
        )}
      {selectedNode.nodeActionType === "control" &&
        (selectedNode.type === "decision") && (
          <UpdateDecisionNode
            nodes={nodes}
            setNodes={setNodes}
            edges={edges}
            setEdges={setEdges}
            selectedNode={selectedNode}
            setNodeInfo={setNodeInfo}
            nodeInfoVar={nodeInfoVar}
            setNodeInfoVar={setNodeInfoVar}
            nodeVariables={nodeVariables}
            setNodeVariables={setNodeVariables}
            nodeExpressions={nodeExpressions}
            setNodeExpressions={setNodeExpressions}
            setSelectedElements={setSelectedElements}
            handleDelete={handleDelete}
          />
        )}
    </>
  );
};

export default NodeEditor;
