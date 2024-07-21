import React, { useState } from "react";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import DeployFlow from "./actionTasks/deployFlow";
import ExecuteFlow from "./actionTasks/executeFlow";
import RefreshStatus from "./actionTasks/refreshStatus";

const Actions = ({
  nodes,
  edges,
  processDefinitionKey,
  setProcessDefinitionKey,
  processInstanceId,
  setProcessInstanceId,
  deploying,
  setDeploying,
  starting,
  setStarting,
  fetching,
  setFetching,
  completedTasks,
  setCompletedTasks,
}) => {
  const [collapse, setCollapse] = useState(false);

  return (
    <div className="absolute inset-y-0 left-72">
      <div className="flex flex-row space-x-4">
        <DeployFlow
          nodes={nodes}
          edges={edges}
          deploying={deploying}
          setDeploying={setDeploying}
          collapse={collapse}
          processDefinitionKey={processDefinitionKey}
          setProcessDefinitionKey={setProcessDefinitionKey}
        />
        <ExecuteFlow
          collapse={collapse}
          starting={starting}
          setStarting={setStarting}
          processInstanceId={processInstanceId}
          setProcessInstanceId={setProcessInstanceId}
          processDefinitionKey={processDefinitionKey}
          setProcessDefinitionKey={setProcessDefinitionKey}
        />
        <RefreshStatus
          collapse={collapse}
          fetching={fetching}
          completedTasks={completedTasks}
          setCompletedTasks={setCompletedTasks}
          setFetching={setFetching}
          processInstanceId={processInstanceId}
          setProcessInstanceId={setProcessInstanceId}
        />
        {!collapse && (
          <FaAngleDoubleLeft
            className="mt-2.5 text-xl text-gray-500 bg-white-200 rounded-full hover:text-indigo-500 hover:scale-110"
            onClick={() => setCollapse(true)}
            title="Collapse"
          />
        )}
        {collapse && (
          <FaAngleDoubleRight
            className="mt-2.5 text-xl text-gray-500 bg-white-200 rounded-full hover:text-indigo-500 hover:scale-110"
            onClick={() => setCollapse(false)}
            title="Expand"
          />
        )}
      </div>
    </div>
  );
};

export default Actions;
