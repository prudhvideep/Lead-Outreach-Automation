import React, { useState } from "react";
import Input from "./toolBarComponents/input";
import Actions from "./toolBarComponents/actions";

const ToolBar = ({ nodes, setNodes, edges, setEdges, completedTasks, setCompletedTasks,reactFlowInstance }) => {
  const [flowName, setFlowName] = useState("");
  const [processDefinitionKey, setProcessDefinitionKey] = useState(null);
  const [processInstanceId, setProcessInstanceId] = useState(null);
  const [deploying, setDeploying] = useState(false);
  const [starting, setStarting] = useState(false);
  const [fetching, setFetching] = useState(false);

  return (
    <>
      <div className="relative flex flex-row mt-2 items-center">
        <Input flowName={flowName} setFlowName={setFlowName} />
        <Actions
          nodes={nodes}
          setNodes={setNodes}
          edges={edges}
          setEdges={setEdges}
          flowName={flowName}
          setFlowName={setFlowName}
          processDefinitionKey={processDefinitionKey}
          setProcessDefinitionKey={setProcessDefinitionKey}
          processInstanceId={processInstanceId}
          setProcessInstanceId={setProcessInstanceId}
          deploying={deploying}
          setDeploying={setDeploying}
          starting={starting}
          setStarting={setStarting}
          fetching={fetching}
          setFetching={setFetching}
          completedTasks={completedTasks}
          setCompletedTasks={setCompletedTasks}
          reactFlowInstance={reactFlowInstance}
        />
      </div>
    </>
  );
};

export default ToolBar;
