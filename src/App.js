import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
  useReactFlow,
  MiniMap,
  Controls,
  Background,
  MarkerType,
} from "reactflow";
import "reactflow/dist/base.css";

//import { v4 as uuidv4 } from 'uuid';
import Sidebar from "./component/Sidebar.js";
import CustomNode from "./component/nodes/CustomNode.js";
import StartNode from "./component/nodes/StartNode.js";
import EndNode from "./component/nodes/EndNode.js";
import WaitNode from "./component/nodes/WaitNode.js";
import ToolBar from "./component/ToolBar.js";
import DecisionNode from "./component/nodes/DecisionNode.js";

// Key for local storage
//const flowKey = "flow-key";

// Define nodeTypes outside the component
const nodeTypes = {
  email: CustomNode,
  sms: CustomNode,
  whatsapp: CustomNode,
  botCall: CustomNode,
  fieldAgent: CustomNode,
  teleCall: CustomNode,
  start: StartNode,
  end: EndNode,
  wait: WaitNode,
  decision: DecisionNode,
};

// Initial node setup
const initialNodes = [];

let id = 0;

// Function for generating unique IDs for nodes
const getId = () => `node_${id++}`;

const App = () => {
  // States and hooks setup
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedElements, setSelectedElements] = useState([]);
  const [nodeName, setNodeName] = useState("");
  const [nodeInfo, setNodeInfo] = useState("");
  const [nodeInfoVar,setNodeInfoVar] = useState("");
  const [nodeVariables, setNodeVariables] = useState({});
  const [nodeExpressions, setNodeExpressions] = useState({});
  const [processDefinitionKey, setProcessDefinitionKey] = useState(null);
  const [processInstanceId, setProcessInstanceId] = useState(null);
  const [deploying, setDeploying] = useState(false);
  const [starting, setStarting] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);

  //Constants
  const EDGE_COLOR = "#b1b1b7";
  const ARROW_SIZE = 16;
  const EDGE_SELECTED_COLOR = "#555";

  // Update nodes data when nodeName or selectedElements changes
  useEffect(() => {
    if (selectedElements.length > 0) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedElements[0]?.id) {
            node.data = {
              ...node.data,
              label: nodeName,
              info: nodeInfo,
              infoVar: nodeInfoVar,
              variables: nodeVariables,
              expressions: nodeExpressions,
            };
          }
          return node;
        })
      );
    } else {
      setNodeName("");
      setNodeInfo("");
      setNodeInfoVar("");
      setNodeVariables({});
      setNodeExpressions({});
    }
  }, [nodeName, nodeInfo, nodeInfoVar, selectedElements, setNodes]);

  // Fetch completed tasks when "Refresh Status" button is clicked
  const fetchCompletedTasks = async () => {
    if (!processInstanceId) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_FLOWABLE_BASE_URL}/monitorProcess/${processInstanceId}/completedTasks`
      );
      const completedTasks = await response.json();
      setCompletedTasks(completedTasks);
    } catch (error) {
      console.error("Error fetching completed tasks: ", error);
    }
  };

  // Highlight completed nodes
  useEffect(() => {
    if (completedTasks.length > 0) {
      setNodes((nds) =>
        nds.map((node) => {
          const isCompleted = completedTasks.some(
            (task) => task.taskKey === node.id
          );
          return {
            ...node,
            data: {
              ...node.data,
              completed: isCompleted,
            },
            style: {
              ...node.style,
              boxShadow: isCompleted ? "0 4px 8px rgba(0, 128, 0, 0.6)" : "",
              backgroundColor: isCompleted ? "#d4f4dd" : "",
            },
          };
        })
      );
    }
  }, [completedTasks, setNodes]);

  // Handle node click
  const onNodeClick = useCallback((event, node) => {
    setSelectedElements([node]);
    setNodeName(node.data.label);
    setNodeInfo(node.data.info);
    setNodeInfoVar(node.data.infoVar);
    setNodeVariables(node.data.variables);
    setNodeExpressions(node.data.expressions);
    setNodes((nodes) =>
      nodes.map((n) => ({
        ...n,
        selected: n.id === node.id,
      }))
    );
  }, []);

  // Setup viewport
  // const { setViewport } = useReactFlow();

  const startProcess = async () => {
    console.log("Process Definition Key ----> ", processDefinitionKey);

    if (processDefinitionKey) {
      setStarting(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_FLOWABLE_BASE_URL}/startProcess`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/xml",
            },
            body: JSON.stringify({ processKey: processDefinitionKey }),
          }
        );

        if (!response.ok) {
          alert("Error Starting the Process");
        }

        const responseObj = await response.json();

        console.log("Response ----> ", responseObj);

        if (!responseObj?.processInstanceId) {
          alert("Process Instance not found. Restart!!!");
        }

        console.log(
          "Process instance Id ----> ",
          responseObj.processInstanceId
        );

        alert(
          `Process started - instance id : ${responseObj.processInstanceId}`
        );

        setProcessInstanceId(responseObj.processInstanceId);
        setStarting(false);
      } catch (error) {
        setStarting(false);
        console.log(`Error! status: ${error}`);
      }
    } else {
      alert("Process deployment key is null. Redeploy!!!");
    }
  };

  // Handle edge connection
  const onConnect = useCallback(
    (params) => {
      console.log("Edge created: ", params);
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const customMarker = {
    type: MarkerType.Arrow,
    width: ARROW_SIZE,
    height: ARROW_SIZE,
    color: EDGE_COLOR,
    strokeWidth: 2,
    markerUnits: "strokeWidth",
    orient: "auto",
  };

  //Edge default option
  const defaultEdgeOptions = {
    type: "smoothstep",
    animated: false,
    style: {
      stroke: EDGE_COLOR,
      transition: "stroke 0.3s ease",
    },
    markerEnd: customMarker,
  };

  //Handle edge click
  const onEdgeClick = useCallback(
    (event, edge) => {
      setEdges((eds) =>
        eds.map((e) => ({
          ...e,
          selected: e.id === edge.id,
          style: {
            ...e.style,
            stroke: e.id === edge.id ? EDGE_SELECTED_COLOR : EDGE_COLOR,
          },
          markerEnd: {
            ...e.markerEnd,
            color: e.id === edge.id ? EDGE_SELECTED_COLOR : EDGE_COLOR,
          },
        }))
      );
    },
    [setEdges]
  );

  // Enable drop effect on drag over
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Handle drop event to add a new node
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const nodeObjStr = event.dataTransfer.getData("application/reactflow");
      const nodeObj = JSON.parse(nodeObjStr);
      const type = nodeObj.type;
      const nodeActionType = nodeObj.nodeActionType;

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type: `${type}`,
        nodeActionType: `${nodeActionType}`,
        position,
        data: {
          label: `${type}`,
          nodeType: type,
          info: "",
          infoVar: "",
          variables: {},
          expressions: {},
        },
      };

      console.log("Node created: ", newNode);
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const rfStyle = {
    backgroundColor: "#ffffff",
  };

  return (
    <div className="flex flex-row min-h-screen lg:flex-row">
      <div className="flex-grow h-screen" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          edges={edges}
          defaultEdgeOptions={defaultEdgeOptions}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onEdgeClick={onEdgeClick}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          style={rfStyle}
          onNodeClick={onNodeClick}
          onPaneClick={() => {
            setSelectedElements([]);
            setNodes((nodes) =>
              nodes.map((n) => ({
                ...n,
                selected: false,
              }))
            );

            setEdges((eds) =>
              eds.map((e) => ({
                ...e,
                selected: false,
                style: {
                  ...e.style,
                  stroke: EDGE_COLOR,
                },
                markerEnd: {
                  ...e.markerEnd,
                  color: EDGE_COLOR,
                },
              }))
            );
          }}
          fitView
          proOptions={{ hideAttribution: true }}
          snapToGrid={true}
          deleteKeyCode={["Backspace", "Delete"]}
          selectionKeyCode={["Control", "Meta"]}
        >
          <Background variant="dots" gap={12} size={1} />
          <Controls />
          <MiniMap zoomable pannable />
          <Panel>
            <ToolBar 
              nodes={nodes} 
              edges={edges} 
            />
          </Panel>
        </ReactFlow>
      </div>

      <Sidebar
        nodes={nodes}
        setNodes={setNodes}
        edges={edges}
        setEdges={setEdges}
        nodeName={nodeName}
        setNodeName={setNodeName}
        nodeInfo={nodeInfo}
        setNodeInfo={setNodeInfo}
        nodeInfoVar={nodeInfoVar}
        setNodeInfoVar={setNodeInfoVar}
        nodeVariables={nodeVariables}
        setNodeVariables={setNodeVariables}
        nodeExpressions={nodeExpressions}
        setNodeExpressions={setNodeExpressions}
        selectedNode={selectedElements[0]}
        setSelectedElements={setSelectedElements}
      />
    </div>
  );
};

// Wrap App with ReactFlowProvider
function FlowWithProvider() {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
}

export default FlowWithProvider;
