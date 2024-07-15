import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
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
  const [nodeVariables, setNodeVariables] = useState({});
  const [processDefinitionKey, setProcessDefinitionKey] = useState(null);
  const [processInstanceId, setProcessInstanceId] = useState(null);
  const [deploying, setDeploying] = useState(false);
  const [starting, setStarting] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);

  //Constants
  const EDGE_COLOR = "#b1b1b7";
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
              variables: nodeVariables,
            };
          }
          return node;
        })
      );
    } else {
      setNodeName(""); // Clear nodeName when no node is selected
      setNodeInfo("");
      setNodeVariables({});
    }
  }, [nodeName, nodeInfo, selectedElements, setNodes]);

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
    setNodeVariables(node.data.variables);
    setNodes((nodes) =>
      nodes.map((n) => ({
        ...n,
        selected: n.id === node.id,
      }))
    );
  }, []);

  // Setup viewport
  const { setViewport } = useReactFlow();

  // Check for empty target handles
  const checkEmptyTargetHandles = () => {
    let emptyTargetHandles = 0;
    edges.forEach((edge) => {
      if (!edge.targetHandle) {
        emptyTargetHandles++;
      }
    });
    return emptyTargetHandles;
  };

  // Check if any node is unconnected
  const isNodeUnconnected = useCallback(() => {
    let unconnectedNodes = nodes.filter(
      (node) =>
        !edges.find(
          (edge) => edge.source === node.id || edge.target === node.id
        )
    );

    return unconnectedNodes.length > 0;
  }, [nodes, edges]);

  const generateProcessDefinitionKey = () => {
    const randomPart = Math.random().toString(36).substr(2, 8);
    const pid = `process-${randomPart}`;

    return pid;
  };

  const convertToBPMN = (nodes, edges) => {
    // Ensure nodes and edges are defined and not empty
    if (nodes.length === 0 || edges.length === 0) {
      console.error("Nodes or edges are undefined or empty");
      return;
    }

    let pdKey = generateProcessDefinitionKey();

    let bpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
  <definitions
   xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xmlns:xsd="http://www.w3.org/2001/XMLSchema"
   xmlns:activiti="http://activiti.org/bpmn"
   xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
   xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC"
   xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI"
   typeLanguage="http://www.w3.org/2001/XMLSchema"
   expressionLanguage="http://www.w3.org/1999/XPath"
   targetNamespace="http://www.flowable.org/processdef">
    <process id="${pdKey}" name="${pdKey}" isExecutable="true">
      <startEvent id="start" name="Start"/>`;

    // Sort nodes based on their connections to ensure sequential order
    const sortedNodes = sortNodesSequentially(nodes, edges);

    if (sortedNodes.length === 0) {
      console.error("Sorted nodes are empty");
      return;
    }

    // Create nodes and sequence flows
    sortedNodes.forEach((node, index) => {
      const nodeType = getNodeType(node.data.nodeType);
      const nodeMethod = getNodeMethod(node.data.nodeType);
      const prevNode = index === 0 ? "start" : sortedNodes[index - 1].id;
      const nextNode = sortedNodes[index + 1]
        ? sortedNodes[index + 1].id
        : "end";

      bpmnXml += `
      <sequenceFlow id="flow${index + 1}" sourceRef="${prevNode}" targetRef="${
        node.id
      }"/>
      <${nodeType} id="${node.id}" name="${
        node.data.label
      }" activiti:class="${nodeMethod}">
        <incoming>flow${index + 1}</incoming>
        <outgoing>flow${index + 2}</outgoing>
      </${nodeType}>`;
    });

    // Add end event
    bpmnXml += `
      <sequenceFlow id="flow${sortedNodes.length + 1}" sourceRef="${
      sortedNodes[sortedNodes.length - 1].id
    }" targetRef="end"/>
      <endEvent id="end" name="End">
        <incoming>flow${sortedNodes.length + 1}</incoming>
      </endEvent>
    </process>
  </definitions>`;

    return bpmnXml;
  };

  const getNodeMethod = (nodeType) => {
    switch (nodeType) {
      case "sms":
        return "com.flowable.services.SMSServiceTask";
      case "botCall":
        return "com.flowable.services.BotCallServiceTask";
      case "whatsapp":
        return "com.flowable.services.WhatsAppSendTask";
      case "email":
        return "com.flowable.services.EmailServiceTask";
      default:
        return "";
    }
  };

  const getNodeType = (nodeType) => {
    switch (nodeType) {
      case "sms":
        return "serviceTask";
      case "email":
        return "serviceTask";
      case "botCall":
        return "serviceTask";
      case "whatsapp":
        return "serviceTask";
      default:
        return "userTask";
    }
  };

  const sortNodesSequentially = (nodes, edges) => {
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));
    const edgeMap = new Map();
    edges.forEach((edge) => {
      if (!edgeMap.has(edge.source)) {
        edgeMap.set(edge.source, []);
      }
      edgeMap.get(edge.source).push(edge.target);
    });

    const sorted = [];
    const visited = new Set();

    const dfs = (nodeId) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      const targets = edgeMap.get(nodeId) || [];
      targets.forEach((targetId) => dfs(targetId));
      sorted.unshift(nodeMap.get(nodeId));
    };

    // Find the start node (node with no incoming edges)
    const startNode = nodes.find(
      (node) => !edges.some((edge) => edge.target === node.id)
    );
    if (startNode) {
      dfs(startNode.id);
    }

    // Handle any disconnected nodes
    nodes.forEach((node) => {
      if (!visited.has(node.id)) {
        sorted.push(node);
      }
    });

    console.log("Sorted nodes: ", sorted);
    return sorted;
  };

  const downloadXml = (bpmnXml) => {
    const blob = new Blob([bpmnXml], { type: "application/xml" });
    const link = document.createElement("a");
    link.download = "flow.bpmn";
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save flow to local storage
  const onSave = useCallback(async () => {
    if (reactFlowInstance) {
      const emptyTargetHandles = checkEmptyTargetHandles();
      console.log("Empty Target Handles ---->", emptyTargetHandles);

      if (nodes.length === 0 || edges.length === 0) {
        alert("Error: Not a valid flow");
        return;
      }

      if (nodes.length > 1 && (emptyTargetHandles > 1 || isNodeUnconnected())) {
        alert(
          "Error: More than one node has an empty target handle or there are unconnected nodes."
        );
        return;
      } else {
        const bpmnXml = convertToBPMN(nodes, edges);

        if (!bpmnXml) {
          console.error("BPMN XML generation failed");
          return;
        }

        // Deploy xml to flowable
        try {
          setDeploying(true);
          const response = await fetch(
            `${process.env.REACT_APP_FLOWABLE_BASE_URL}/deployProcess`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/xml",
              },
              body: bpmnXml,
            }
          );

          if (!response.ok) {
            console.log(`Error! status: ${response.status}`);
          }

          const responseObj = await response.json();

          if (!responseObj?.processDefinitionKey) {
            alert("Error: Process Deployment Failed!!!");
            return;
          }

          console.log(
            "Process Definition Key ----> ",
            responseObj.processDefinitionKey
          );

          alert(
            `Process Deployed - deployment key : ${responseObj.processDefinitionKey}`
          );

          setProcessDefinitionKey(responseObj.processDefinitionKey);
          setDeploying(false);
        } catch (error) {
          console.error("Error during deployment ----> ", error);
          alert("Error: Process Deployment Failed!!!");
        }

        downloadXml(bpmnXml);
      }
    }
  }, [reactFlowInstance, nodes, isNodeUnconnected]);

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

  //Edge default option
  const defaultEdgeOptions = {
    type: "default",
    animated: false,
    style: {
      stroke: EDGE_COLOR,
      transition: "stroke 0.3s ease",
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: EDGE_COLOR,
    },
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
          variables: {},
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
        nodeVariables={nodeVariables}
        setNodeVariables={setNodeVariables}
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
