import React, { useState } from "react";
import Input from "./toolBarComponents/input";
import Actions from "./toolBarComponents/actions";

const ToolBar = ({ nodes, edges, completedTasks, setCompletedTasks }) => {
  const [flowName, setFlowName] = useState("");
  const [processDefinitionKey, setProcessDefinitionKey] = useState(null);
  const [processInstanceId, setProcessInstanceId] = useState(null);
  const [deploying, setDeploying] = useState(false);
  const [starting, setStarting] = useState(false);
  const [fetching, setFetching] = useState(false);

  return (
    <>
    <div className="relative mt-2">
      <Input flowName={flowName} setFlowName={setFlowName} />
      <Actions
        nodes={nodes}
        edges={edges}
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
      />
    </div>
    </>
  );
};

export default ToolBar;
