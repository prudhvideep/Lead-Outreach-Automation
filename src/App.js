import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
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
import { GiConsoleController } from "react-icons/gi";
import { SiWritedotas } from "react-icons/si";

// Key for local storage
//const flowKey = "flow-key";

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
  const [nodeInfoVar, setNodeInfoVar] = useState("");
  const [nodeVariables, setNodeVariables] = useState({});
  const [nodeExpressions, setNodeExpressions] = useState({});
  const [nodeTemplates, setNodeTemplates] = useState([]);
  const [selectedNodeTemplate,setSelectedNodeTemplate] = useState({});
  const [completedTasks, setCompletedTasks] = useState([]);
  const nodeCountsRef = useRef({
    sms: 0,
    whatsapp: 0,
    email: 0,
    botCall: 0,
    fieldAgent: 0,
    teleCall: 0,
    wait: 0,
  });

  const nodeTypes = useMemo(
    () => ({
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
    }),
    []
  );

  //Constants
  const EDGE_COLOR = "#d1d1d7";
  const EDGE_COMPLETED_COLOR = "#4f46e5";
  const ARROW_SIZE = 18;
  const EDGE_SELECTED_COLOR = "#555";
  const DEFAULT_VIEWPORT = { x: 0, y: 0, zoom: 0.75 };

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
              selectedNodeTemplate : selectedNodeTemplate,
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

  useEffect(() => {
    if (completedTasks.length > 0) {
      const completedNodeIds = completedTasks.map((task) => task.taskKey);

      setEdges((eds) =>
        eds.map((edge) => {
          const isCompleted =
            completedNodeIds.includes(edge.source) &&
            completedNodeIds.includes(edge.target);
          return {
            ...edge,
            style: {
              ...edge.style,
              stroke: isCompleted ? EDGE_COMPLETED_COLOR : EDGE_COLOR,
              transition: "all 0.3s ease",
              opacity: isCompleted ? 1 : 0.5,
            },
            animated: isCompleted,
            markerEnd: {
              ...edge.markerEnd,
              color: isCompleted ? EDGE_COMPLETED_COLOR : EDGE_COLOR,
            },
          };
        })
      );
    }
  }, [completedTasks, setNodes, setEdges]);

  const getNodeTemplates = (nodeType) => {
    switch (nodeType) {
      case "sms":
        return [
          {
            name: "Payment Reminder",
            body: `Hi {name}, Please Find The Payment Link For The Loan {loan_num}, With CLU: {link}. Please Click On The Link To Pay. -CLUCLOUD`,
          },
          {
            name: "Payment Link Follow-up",
            body: `Dear {name},\n\nWe have sent a payment link on {date}. Please make the payment at your earliest convenience. Press 1 to receive the payment link again or 2 to request a callback.\n\nThank you.`,
          },
        ];
      case "whatsapp":
        return [
          {
            name: "WhatsApp Payment Reminder",
            body: `Hello {name},\n\nThis is a reminder that your loan account {loan_num} has an outstanding amount of {amount}. Please complete the payment using this link: {link}.\n\nThank you.`,
          },
          {
            name: "WhatsApp Follow-up",
            body: `Hi {name},\n\nWe sent you a payment link on {date}. Please use it to make your payment. Reply with 1 to receive the link again or 2 for a callback.\n\nThank you.`,
          },
          {
            name: "WhatsApp Loan Account Summary",
            body: `Dear {name},\n\nHere is a summary of your loan account:\nLoan Number: {loan_num}\nOutstanding Balance: {amount}\nPlease make your payment using this link: {link}.\n\nThank you.`,
          },
          {
            name: "WhatsApp Final Reminder",
            body: `Dear {name},\n\nThis is a final reminder to pay {amount} for your loan account {loan_num}. Click here to make the payment: {link}.\n\nThank you.`,
          },
          {
            name: "WhatsApp Payment Incentive",
            body: `Hello {name},\n\nPay your due amount of {amount} by {due_date} and receive {offer}. Use this link to complete the payment: {link}.\n\nThank you.`,
          },
        ];

      case "email":
        return [
          {
            name: "Email Payment Reminder",
            body: "Dear {name},\n\nWe wanted to remind you that your loan account {loan_num} has a pending amount of {amount}. Please click the following link to make your payment: {link}\n\nThank you.",
          },
          {
            name: "Email Follow-up",
            body: "Dear {name},\n\nWe sent you a payment link on {date}, but we noticed that the payment is still pending. Please make the payment at your earliest convenience using this link: {link}.\n\nIf you need any assistance, don't hesitate to reply to this email.",
          },
          {
            name: "Email Final Notice",
            body: "Dear {name},\n\nThis is a final reminder that your payment for loan account {loan_num} is overdue. Please make the payment of {amount} immediately using this link: {link} to avoid any penalties.\n\nBest regards.",
          },
          {
            name: "Email Account Closure Warning",
            body: "Dear {name},\n\nWe regret to inform you that your loan account {loan_num} is at risk of closure due to non-payment. Please pay the outstanding amount of {amount} using this link: {link} to keep your account in good standing.\n\nContact us if you need assistance.",
          },
          {
            name: "Email Payment Confirmation",
            body: "Dear {name},\n\nThank you for your payment of {amount} towards your loan account {loan_num}. We have received your payment and your account is now up to date.\n\nFor any further assistance, please feel free to contact us.",
          },
        ];
      case "botCall":
        return [
          {
            name: "Bot Call Payment Reminder",
            body: `This is an automated message for {name}. Your loan account {loan_num} has a pending amount of {amount}. Press 1 to make a payment or 2 to receive a payment link via SMS.\n\nThank you.`,
          },
          {
            name: "Bot Call Follow-up",
            body: `Hello {name},\n\nThis is a follow-up regarding your pending payment for loan account {loan_num}. Press 1 to make the payment or 2 to schedule a callback with a representative.\n\nThank you.`,
          },
          {
            name: "Bot Call Final Reminder",
            body: `Dear {name},\n\nThis is your final reminder to pay the outstanding amount of {amount} for loan account {loan_num}. Press 1 to pay now or 2 to receive the payment link via WhatsApp.\n\nThank you.`,
          },
        ];

      default:
        return [{ name: "", body: "" }];
    }
  };

  const onNodeClick = useCallback((event, node) => {
    setSelectedElements([node]);
    setNodeName(node.data.label);
    setNodeInfo(node.data.info);
    setNodeInfoVar(node.data.infoVar);
    setNodeVariables(node.data.variables);
    setNodeExpressions(node.data.expressions);
    setNodeTemplates(node.data.templates || []);
    setSelectedNodeTemplate(node.data.selectedNodeTemplate || {});
    setNodes((nodes) =>
      nodes.map((n) => ({
        ...n,
        selected: n.id === node.id,
      }))
    );
  }, []);

  const onConnect = useCallback(
    (params) => {
      console.log("Edge created: ", params);
      setEdges((eds) => addEdge(params, eds));
      console.log("Edges ----> ", edges);
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

  const defaultEdgeOptions = {
    type: "smoothstep",
    animated: false,
    style: {
      stroke: EDGE_COLOR,
      strokeWidth: 2,
      transition: "stroke 0.3s ease",
    },
    markerEnd: customMarker,
  };

  const onEdgeClick = useCallback(
    (event, edge) => {
      setEdges((eds) =>
        eds.map((e) => ({
          ...e,
          selected: e.id === edge.id,
          style: {
            ...e.style,
            stroke: e.id === edge.id ? EDGE_SELECTED_COLOR : EDGE_COLOR,
            strokeWidth: 2,
          },
          markerEnd: {
            ...e.markerEnd,
            color: e.id === edge.id ? EDGE_SELECTED_COLOR : EDGE_COLOR,
            strokeWidth: 2,
          },
        }))
      );
    },
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const getExpressionOptions = (nodeType) => {
    switch (nodeType) {
      case "sms":
        return "smsStatus";
      case "whatsapp":
        return "messageStatus";
      case "email":
        return "emailStatus";
      case "teleCall":
      case "botCall":
        return "callStatus";
      case "wait":
        return "paymentStatus";
      default:
        return "status";
    }
  };

  const handleStatusChange = useCallback(
    (nodeId, status, position, nodeType) => {
      console.log("Node id ---->", nodeId);
      console.log("status ---> ", status);
      console.log("Position ----> ", position);
      console.log("Node Type ----> ", nodeType);

      if (reactFlowInstance) {
        const offsetX = 200;
        const offsetY = 200;

        const newPosition = {
          x: position.x + offsetX,
          y: position.y + offsetY,
        };

        const newNodeType = "decision";
        const newNodeId = getId();
        const newDecisionNode = {
          id: newNodeId,
          type: newNodeType,
          nodeActionType: "control",
          position: newPosition,
          data: {
            id : newNodeId,
            name: `${getNodeName(newNodeType)}`,
            label: `${newNodeType}`,
            status: "",
            nodeType: newNodeType,
            info: "",
            infoVar: "",
            decisionNode: {},
            variables: {},
            selectedTemplate : {},
            templates: getNodeTemplates(newNodeType),
            onStatusChange: handleStatusChange,
            onExpressionChange: handleExpressionChange,
            position: newPosition,
            decisionNode: nodeId,
            expressions: {
              [`${getExpressionOptions(nodeType)}`]: {
                condition: `==`,
                value: status,
              },
            },
          },
        };

        console.log("Node created: ", newDecisionNode);

        // Update nodes and edges
        setNodes((nds) => nds.concat(newDecisionNode));

        const newEdge = {
          type: "smoothstep",
          animated: false,
          style: {
            stroke: "#d1d1d7",
            strokeWidth: 2,
            transition: "stroke 0.3s ease",
          },
          markerEnd: {
            type: "arrow",
            width: 18,
            height: 18,
            color: "#d1d1d7",
            strokeWidth: 2,
            markerUnits: "strokeWidth",
            orient: "auto",
          },
          source: nodeId,
          sourceHandle: "b",
          target: newNodeId,
          targetHandle: "a",
        };

        setEdges((eds) => addEdge(newEdge, eds));
      } else {
        console.error("React Flow instance is not available");
      }
    },
    [reactFlowInstance, setNodes, setEdges]
  );

  const handleDeleteNode = (id) => {
    console.log("handle delete node")
    console.log("node id -----> ",id);
    setNodes((nds) => {
      const filteredNodes = nds.filter((node) => node.id !== id );

      return filteredNodes;
    })
  }

  const handleExpressionChange = useCallback(
    (expressions) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.selected) {
            let newExpressions = {};

            if (Array.isArray(expressions)) {
              expressions.forEach((expr) => {
                if (expr.field && expr.operator && expr.value) {
                  newExpressions[expr.field] = {
                    condition: expr.operator,
                    value: expr.value,
                  };
                }
              });
            } else if (typeof expressions === "object") {
              Object.entries(expressions).forEach(([field, value]) => {
                if (value.condition && value.value) {
                  newExpressions[field] = {
                    condition: value.condition,
                    value: value.value,
                  };
                }
              });
            }

            node.data = {
              ...node.data,
              expressions: newExpressions,
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  const getNodeName = (nodeType) => {
    nodeCountsRef.current[nodeType] =
      (nodeCountsRef.current[nodeType] || 0) + 1;
    const count = nodeCountsRef.current[nodeType];
    return `${nodeType}#${count}`;
  };

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

      const newNodeId = getId();

      const newNode = {
        id: newNodeId,
        type: `${type}`,
        nodeActionType: `${nodeActionType}`,
        position,
        data: {
          id: newNodeId,
          name: `${getNodeName(type)}`,
          label: `${type}`,
          status: "",
          nodeType: type,
          info: "",
          infoVar: "",
          decisionNode: {},
          variables: {},
          expressions: {},
          templates: getNodeTemplates(type),
          onStatusChange: handleStatusChange,
          onDeleteNode : handleDeleteNode,
          onExpressionChange: handleExpressionChange,
          position: position,
        },
      };

      console.log("Node created: ", newNode);
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const rfStyle = {
    backgroundColor: "#1E1E1E",
  };

  // Handle pane click
  const onPaneClick = () => {
    setSelectedElements([]);
    setNodes((nodes) =>
      nodes.map((n) => ({
        ...n,
        selected: false,
      }))
    );

    setEdges((eds) =>
      eds.map((e) => {
        const isCompleted =
          completedTasks.map((task) => task.taskKey).includes(e.source) &&
          completedTasks.map((task) => task.taskKey).includes(e.target);
        return {
          ...e,
          selected: false,
          style: {
            ...e.style,
            stroke: isCompleted ? EDGE_COMPLETED_COLOR : EDGE_COLOR,
            opacity: isCompleted ? 1 : 0.5,
            strokeWidth: 2,
          },
          markerEnd: {
            ...e.markerEnd,
            color: isCompleted ? EDGE_COMPLETED_COLOR : EDGE_COLOR,
            width: ARROW_SIZE,
            height: ARROW_SIZE,
          },
        };
      })
    );
  };

  return (
    <div className="flex flex-row min-h-screen">
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
          onPaneClick={onPaneClick}
          proOptions={{ hideAttribution: true }}
          snapToGrid={true}
          deleteKeyCode={["Backspace", "Delete"]}
          selectionKeyCode={["Control", "Meta"]}
          defaultViewport={DEFAULT_VIEWPORT}
        >
          <Background variant="dots" gap={14} size={2} color="#333" />
          <Panel>
            <ToolBar
              nodes={nodes}
              edges={edges}
              completedTasks={completedTasks}
              setCompletedTasks={setCompletedTasks}
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
        nodeTemplates={nodeTemplates}
        selectedNodeTemplate={selectedNodeTemplate}
        setSelectedNodeTemplate={setSelectedNodeTemplate}
      />
    </div>
  );
};

function FlowWithProvider() {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
}

export default FlowWithProvider;
