import React, { useCallback } from "react";
import { GrDeploy } from "react-icons/gr";
import { ImSpinner } from "react-icons/im";

const DeployFlow = ({
  nodes,
  edges,
  collapse,
  deploying,
  setDeploying,
  setProcessDefinitionKey,
}) => {
  const checkEmptyTargetHandles = () => {
    let emptyTargetHandles = 0;
    edges.forEach((edge) => {
      if (!edge.targetHandle) {
        emptyTargetHandles++;
      }
    });
    return emptyTargetHandles;
  };

  const generateProcessDefinitionKey = () => {
    const randomPart = Math.random().toString(36).substr(2, 8);
    return `process-${randomPart}`;
  };

  const convertToBPMN = (nodes, edges) => {
    if (nodes.length === 0 || edges.length === 0) {
      console.error("Nodes or edges are undefined or empty");
      return;
    }

    let pdKey = generateProcessDefinitionKey();

    let bpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI"
  xmlns:flowable="http://flowable.org/bpmn"
  typeLanguage="http://www.w3.org/2001/XMLSchema"
  expressionLanguage="http://www.w3.org/1999/XPath"
  targetNamespace="http://www.flowable.org/processdef">
    <process id="${pdKey}" name="${pdKey}" isExecutable="true">`;

    const nodeMap = new Map(nodes.map((node) => [node.id, node]));
    const edgeMap = new Map();
    edges.forEach((edge) => {
      if (!edgeMap.has(edge.source)) {
        edgeMap.set(edge.source, []);
      }
      edgeMap.get(edge.source).push(edge);
    });

    const visited = new Set();
    let flowCounter = 1;

    const dfs = (nodeId, prevNodeId) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const node = nodeMap.get(nodeId);
      console.log("Node Map ----- > ", nodeMap);
      const nodeType = getNodeType(node.type);
      console.log("Node type ----> ", node.data.nodeType);
      const nodeMethod = getNodeMethod(node.data.nodeType);
      const nextEdges = edgeMap.get(nodeId) || [];

      if (nodeType === "startEvent") {
        bpmnXml += `
        <${nodeType} id="${node.id}" name="${node.data.label}"/>`;
      } else if (nodeType === "endEvent") {
        bpmnXml += `
        <sequenceFlow id="flow_${flowCounter++}" sourceRef="${prevNodeId}" targetRef="${
          node.id
        }"/>
        <${nodeType} id="${node.id}" name="${node.data.label}"/>`;
      } else if (nodeType === "exclusiveGateway") {
        bpmnXml += `
        <sequenceFlow id="flow_${flowCounter++}" sourceRef="${prevNodeId}" targetRef="${
          node.id
        }"/>
        <${nodeType} id="${node.id}" name="${node.data.label}"/>`;

        if (Object.keys(node.data.expressions).length > 0) {
          const expressionKey = Object.keys(node.data.expressions)[0];
          const expressionCondition =
            node.data.expressions[expressionKey].condition;
          const expressionValue = node.data.expressions[expressionKey].value;

          nextEdges.forEach((edge, idx) => {
            const isPositivePath = edge.sourceHandle === "yes";
            let condition;
            if (isPositivePath) {
              condition = `\${${expressionKey} ${expressionCondition} '${expressionValue}'}`;
            } else {
              condition = `\${${expressionKey} ${getOppositeCondition(
                expressionCondition
              )} '${expressionValue}'}`;
            }

            bpmnXml += `
            <sequenceFlow id="flow_${flowCounter}" sourceRef="${node.id}" targetRef="${edge.target}" name="${edge.sourceHandle}">
              <conditionExpression xsi:type="tFormalExpression"><![CDATA[${condition}]]></conditionExpression>
            </sequenceFlow>`;

            flowCounter++;
          });
        }
      } else {
        bpmnXml += `
        <sequenceFlow id="flow_${flowCounter++}" sourceRef="${prevNodeId}" targetRef="${
          node.id
        }"/>
        <${nodeType} id="${node.id}" name="${
          node.data.label
        }" flowable:class="${nodeMethod}">
           ${generateFieldExtensions(node.data, nodeType)}
          <incoming>flow_${flowCounter - 1}</incoming>
          <outgoing>flow_${flowCounter}</outgoing>
        </${nodeType}>`;
      }

      nextEdges.forEach((edge) => {
        dfs(edge.target, node.id);
      });
    };

    const getOppositeCondition = (condition) => {
      switch (condition) {
        case "==":
          return "!=";
        case "!=":
          return "==";
        case ">":
          return "<=";
        case "<":
          return ">=";
        case ">=":
          return "<";
        case "<=":
          return ">";
        default:
          return "!=";
      }
    };

    const generateFieldExtensions = (data, nodeType) => {
      if (!data.variables && !data.expressions) return "";

      let extensions = "<extensionElements>";
      if (data.variables) {
        Object.entries(data.variables).forEach(([key, value]) => {
          extensions += `
            <flowable:formProperty id="${key}" name="${value}" type="string" required="true"/>`;
        });
        if (nodeType === "serviceTask") {
          extensions += `
            <flowable:executionListener event="start" class="com.flowable.listeners.ServiceTaskPropertiesListener"/>`;
        } else if (nodeType === "userTask") {
          extensions += `
            <flowable:executionListener event="start" class="com.flowable.listeners.UserTaskPropertiesListener"/>`;
        }
      }
      extensions += `
           </extensionElements>`;
      return extensions;
    };

    const startNode = nodes.find((node) => node.type === "start");
    if (startNode) {
      dfs(startNode.id, "start");
    }

    bpmnXml += `
      </process>
  </definitions>`;

    return bpmnXml;
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
      case "wait":
        return "com.flowable.services.WaitServiceTask";
      case "decision":
        return "";
      default:
        return "";
    }
  };

  const getNodeType = (type) => {
    switch (type) {
      case "start":
        return "startEvent";
      case "end":
        return "endEvent";
      case "sms":
      case "whatsapp":
      case "email":
      case "botCall":
      case "wait":
        return "serviceTask";
      case "fieldAgent":
      case "teleCall":
        return "userTask";
      case "decision":
        return "exclusiveGateway";
      default:
        return "userTask";
    }
  };

  const isNodeUnconnected = useCallback(() => {
    let unconnectedNodes = nodes.filter(
      (node) =>
        !edges.find(
          (edge) => edge.source === node.id || edge.target === node.id
        )
    );

    return unconnectedNodes.length > 0;
  }, [nodes, edges]);

  const handleDeploy = async () => {
    const emptyTargetHandles = checkEmptyTargetHandles();

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
      setDeploying(true);
      const bpmnXml = convertToBPMN(nodes, edges);

      if (!bpmnXml) {
        console.error("BPMN XML generation failed");
        setDeploying(false);
        return;
      }

      // Deploy xml to flowable
      try {
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
          setDeploying(false);
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
        setDeploying(false);
        alert("Error: Process Deployment Failed!!!");
      }

      //downloadXml(bpmnXml);
    }
  };

  return (
    <div
      className={`p-2 text-gray-500 border-2 border-gray-500 bg-gray-50 rounded-full hover:text-indigo-500 hover:border-indigo-500 hover:scale-110 transition-all duration-300 ease-in-out ${
        collapse ? "hidden" : ""
      } ${deploying ? "cursor-not-allowed" : "cursor-pointer"}`}
      title={deploying ? "Deploying..." : "Deploy Flow"}
      onClick={deploying ? null : handleDeploy}
    >
      {deploying ? (
        <ImSpinner className="text-xl animate-spin text-indigo-500" />
      ) : (
        <GrDeploy className="text-xl" />
      )}
    </div>
  );
};

export default DeployFlow;
