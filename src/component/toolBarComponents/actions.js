import React, { useEffect, useState } from "react";
import { useReactFlow, useStore } from "reactflow";
import DeployFlow from "./actionTasks/deployFlow";
import ExecuteFlow from "./actionTasks/executeFlow";
import RefreshStatus from "./actionTasks/refreshStatus";
import {
  FaExpand,
  FaSearchMinus,
  FaSearchPlus,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { BsFloppy } from "react-icons/bs";
import { IoFolderOutline } from "react-icons/io5";
import FlowModal from "./actionComponents/flowModal";

const Actions = ({
  nodes,
  setNodes,
  edges,
  setEdges,
  flowName,
  setFlowName,
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
  reactFlowInstance,
}) => {
  const [zoomLevel, setZoomLevel] = useState();
  const [collapse, setCollapse] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { fitView, zoomIn, zoomOut } = useReactFlow();
  const currentZoom = useStore((state) => state.transform[2]);

  const handleSave = () => {
    if (!flowName || flowName === "") {
      alert("Flowname cannot be null");
      return;
    }

    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem(flowName, JSON.stringify(flow));
      alert("Saved successful!");
    }
  };

  useEffect(() => {
    setZoomLevel(Math.round(currentZoom * 100));
  }, [currentZoom]);

  return (
    <div className="absolute inset-y-1 left-[220px]">
      <div className="transition-all duration-300 ease-in-out flex flex-row space-x-2 items-center justify-center">
        {!collapse && (
          <button
            title="Open Flow"
            className="bg-customgray rounded-md p-1 outline outline-gray-700 hover:bg-highlightedgray"
            onClick={() => setShowModal(true)}
          >
            <IoFolderOutline className="text-white text-md font-extralight" />
          </button>
        )}
        {!collapse && (
          <button
            title="Save Flow"
            className="bg-customgray rounded-md p-1 outline outline-gray-700 hover:bg-highlightedgray"
            onClick={handleSave}
          >
            <BsFloppy className="text-white text-md font-extralight" />
          </button>
        )}
        {!collapse && (
          <button
            title="Full Screen"
            className="bg-customgray rounded-md p-1 outline outline-gray-700 hover:bg-highlightedgray"
            onClick={fitView}
          >
            <FaExpand className="text-white text-md font-extralight" />
          </button>
        )}
        {!collapse && (
          <button
            title="Zoom Im"
            className="bg-customgray rounded-md p-1 outline outline-gray-700 hover:bg-highlightedgray"
            onClick={zoomIn}
          >
            <FaSearchPlus className="text-white text-md font-extralight" />
          </button>
        )}
        {!collapse && (
          <span className="bg-highlightedgray rounded-md p-1 pl-2 pr-2 text-xs text-gray-300 font-medium">
            {zoomLevel}%
          </span>
        )}
        {!collapse && (
          <button
            title="Zoom Out"
            className="bg-customgray rounded-md p-1 outline outline-gray-700 hover:bg-highlightedgray"
            onClick={zoomOut}
          >
            <FaSearchMinus className="text-white text-md font-extralight" />
          </button>
        )}
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
            className="text-xl text-gray-300 bg-white-200 rounded-full hover:text-indigo-500 hover:scale-110"
            onClick={() => setCollapse(true)}
            title="Collapse"
          />
        )}
        {collapse && (
          <FaAngleDoubleRight
            className="mt-1 text-xl text-gray-300 bg-white-200 rounded-full hover:text-indigo-500 hover:scale-110"
            onClick={() => setCollapse(false)}
            title="Expand"
          />
        )}
      </div>
      {showModal && 
        <FlowModal 
          setNodes={setNodes}
          setEdges={setEdges}
          setShowModal={setShowModal} 
          setFlowName={setFlowName}
          reactFlowInstance={reactFlowInstance}
        />}
    </div>
  );
};

export default Actions;
