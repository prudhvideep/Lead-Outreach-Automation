import React, { useState } from "react";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import DeployFlow from "./actionTasks/deployFlow";
import ExecuteFlow from "./actionTasks/executeFlow";
import RefreshStatus from "./actionTasks/refreshStatus";

const Actions = ( {nodes,edges} ) => {
  const [collapse, setCollapse] = useState(false);
  const [processDefinitionKey,setProcessDefinitionKey] = useState('');

  return (
    <div className="absolute inset-y-0 left-72">
      <div className="flex flex-row space-x-4">
        <DeployFlow
          nodes={nodes}
          edges={edges}
          collapse={collapse}
          processDefinitionKey={processDefinitionKey}
          setProcessDefinitionKey={setProcessDefinitionKey}
        />
        <ExecuteFlow
          collapse={collapse}
        />
        <RefreshStatus
          collapse={collapse}
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
