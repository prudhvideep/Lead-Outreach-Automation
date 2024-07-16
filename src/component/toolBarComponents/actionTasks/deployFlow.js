import React, { useCallback } from "react";
import { GrDeploy } from "react-icons/gr";

const DeployFlow = ({ nodes, edges, collapse, setProcessDefinitionKey }) => {
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

  const generateProcessDefinitionKey = () => {
    const randomPart = Math.random().toString(36).substr(2, 8);
    const pid = `process-${randomPart}`;

    return pid;
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
      const bpmnXml = convertToBPMN(nodes, edges);

      if (!bpmnXml) {
        console.error("BPMN XML generation failed");
        return;
      }

      // Deploy xml to flowable
      // try {
      //   const response = await fetch(
      //     `${process.env.REACT_APP_FLOWABLE_BASE_URL}/deployProcess`,
      //     {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/xml",
      //       },
      //       body: bpmnXml,
      //     }
      //   );

      //   if (!response.ok) {
      //     console.log(`Error! status: ${response.status}`);
      //   }

      //   const responseObj = await response.json();

      //   if (!responseObj?.processDefinitionKey) {
      //     alert("Error: Process Deployment Failed!!!");
      //     return;
      //   }

      //   console.log(
      //     "Process Definition Key ----> ",
      //     responseObj.processDefinitionKey
      //   );

      //   alert(
      //     `Process Deployed - deployment key : ${responseObj.processDefinitionKey}`
      //   );

      //   setProcessDefinitionKey(responseObj.processDefinitionKey);
      // } catch (error) {
      //   console.error("Error during deployment ----> ", error);
      //   alert("Error: Process Deployment Failed!!!");
      // }

      downloadXml(bpmnXml);
    }
  };

  return (
    <div
      className={`p-2 text-gray-500 border-2 border-gray-500 bg-gray-50 rounded-full hover:text-indigo-500 hover:border-indigo-500 hover:scale-110 transition-all duration-300 ease-in-out  ${
        collapse ? "hidden" : ""
      }`}
      title="Deploy Flow"
    >
      <GrDeploy className="text-xl" onClick={handleDeploy} />
    </div>
  );
};

export default DeployFlow;
