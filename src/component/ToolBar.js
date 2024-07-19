import React, { useState } from "react";
import Input from "./toolBarComponents/input";
import FlowIcon from "./toolBarComponents/flowIcon";
import Actions from "./toolBarComponents/actions";

const ToolBar = ({ nodes, edges }) => {
  const [flowName, setFlowName] = useState("");

  return (
    <div className="relative mt-2">
      <Input 
        flowName={flowName} 
        setFlowName={setFlowName} 
      />
      <Actions 
        nodes={nodes} 
        edges={edges} 
      />
    </div>
  );
};

export default ToolBar;
