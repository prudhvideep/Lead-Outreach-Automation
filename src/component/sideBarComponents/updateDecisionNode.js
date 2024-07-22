import React, { useState } from "react";
import Select from "react-select";
import { FaTrashAlt } from "react-icons/fa";
import { HiVariable } from "react-icons/hi2";
import { TbMathFunction } from "react-icons/tb";

export default function UpdateDecisionNode({
  nodes,
  setNodes,
  edges,
  setEdges,
  selectedNode,
  setNodeExpressions,
  nodeExpressions,
  setSelectedElements,
  handleDelete,
}) {
  const [expression, setExpression] = useState({
    name: "",
    condition: "",
    value: "",
  });
  const [addExpression, setAddExpression] = useState(false);
  const [editExpression, setEditExpression] = useState(false);
  const [decisionNode, setDecisionNode] = useState(
    selectedNode.data.decisionNode
  );

  const handleExpressionNameChange = (event) => {
    setExpression((prev) => ({ ...prev, name: event.value }));
  };

  const handleExpressionConditionChange = (event) => {
    setExpression((prev) => ({ ...prev, condition: event.value }));
  };

  const handleExpressionValueChange = (event) => {
    setExpression((prev) => ({ ...prev, value: event.value }));
  };

  const handleCreateExpression = () => {
    let updatedExpressions = {
      ...nodeExpressions,
      [`${decisionNode?.value}$${expression.name}`]: {
        condition: expression.condition,
        value: expression.value,
      },
    };
    setNodeExpressions(updatedExpressions);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              expressions: updatedExpressions,
            },
          };
        }
        return node;
      })
    );
    setExpression({ name: "", condition: "", value: "" });
    setAddExpression(false);
  };

  const handleEditExpression = () => {
    let updatedExpressions = {
      ...nodeExpressions,
      [`${decisionNode?.value}$${expression.name}`]: {
        condition: expression.condition,
        value: expression.value,
      },
    };
    setNodeExpressions(updatedExpressions);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              expressions: updatedExpressions,
            },
          };
        }
        return node;
      })
    );
    setEditExpression(false);
    setExpression({ name: "", condition: "", value: "" });
  };

  const handleDeleteExpression = (key) => {
    const updatedExpressions = { ...nodeExpressions };
    delete updatedExpressions[key];
    setNodeExpressions(updatedExpressions);

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              expressions: updatedExpressions,
            },
          };
        }
        return node;
      })
    );
  };

  const handleSelectChange = (event) => {
    setDecisionNode(event);
    setExpression({ name: "", condition: "", value: "" });
    setNodeExpressions({});
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              decisionNode: event,
              expressions: {},
            },
          };
        }
        return node;
      })
    );
  };

  const conditionOptions = [
    { value: "==", label: "==" },
    { value: "!=", label: "!=" },
  ];

  const getExpressionOptions = () => {
    let nodeType = decisionNode?.label ? decisionNode.label.split("#")[0] : "";

    switch (nodeType) {
      case "sms":
      case "whatsapp":
        return [{ value: "messageStatus", label: "messageStatus" }];
      case "email":
        return [{ value: "emailStatus", label: "emailStatus" }];
      case "teleCall":
      case "botCall":
        return [{ value: "callStatus", label: "callStatus" }];
      case "wait":
        return [{ value: "paymentStatus", label: "paymentStatus" }];
      default:
        return [{ value: "status", label: "status" }];
    }
  };

  const getStatusOptions = () => {
    let nodeType = decisionNode?.label ? decisionNode.label.split("#")[0] : "";

    switch (nodeType) {
      case "sms":
        return [
          { value: "Delivered", label: "Delivered" },
          { value: "Failed", label: "Failed" },
        ];
      case "whatsapp":
        return [
          { value: "Delivered", label: "Delivered" },
          { value: "Read", label: "Read" },
          { value: "Failed", label: "Failed" },
        ];
      case "email":
        return [
          { value: "Sent", label: "Sent" },
          { value: "Failed", label: "Failed" },
        ];
      case "botCall":
      case "teleCall":
        return [
          { value: "Answered", label: "Answered" },
          { value: "Wrong Number", label: "Wrong Number" },
          { value: "No Response", label: "No Response" },
        ];
      case "wait":
        return [
          { value: "Received", label: "Received" },
          { value: "Not Received", label: "Not Received" },
        ];
      default:
        return [{ value: "status", label: "status" }];
    }
  };

  const getPrecedingNodes = () => {
    const visited = new Set();
    const queue = [];

    const startNode = nodes.find((node) => node.type === "start");
    if (!startNode) return [];

    queue.push(startNode.id);
    visited.add(startNode.id);

    let precedingNodes = [];

    while (queue.length > 0) {
      const currentNodeId = queue.shift();
      const currentNode = nodes.find((node) => node.id === currentNodeId);

      precedingNodes.push(currentNode);

      edges.forEach((edge) => {
        if (edge.source === currentNodeId && !visited.has(edge.target)) {
          queue.push(edge.target);
          visited.add(edge.target);
        }
      });

      if (currentNodeId === selectedNode.id) break;
    }

    precedingNodes = precedingNodes.filter(
      (node) =>
        (node.type !== "start" && node.type !== "end" && node.type !== "decision")
    );

    return precedingNodes
      .filter((node) => node.id !== selectedNode.id && node.type !== "decision")
      .map((node) => ({
        value: node.id,
        label: node.data?.name,
      }));
  };

  return (
    <div>
      <h3 className="text-xl mb-4 text-gray-800 font-semibold">
        Update Decision Node
      </h3>
      <div className="p-4 space-y-4 border-gray-200 border-2 rounded-xl hover:border-gray-400 bg-white">
        <p className="font-medium text-gray-800">Select Node</p>
        <Select
          options={getPrecedingNodes()}
          placeholder="Select Node"
          className="basic-single"
          classNamePrefix="select"
          value={decisionNode}
          onChange={(event) => {
            handleSelectChange(event);
          }}
        />
      </div>
      {Object.keys(decisionNode).length !== 0 && (
        <div className="mt-4 p-4 space-y-4 border-gray-200 border-2 rounded-xl hover:border-gray-400 bg-white">
          <p className="font-medium text-gray-800">Expressions</p>
          {Object.keys(nodeExpressions).length > 0 && (
            <div className="relative space-y-2 bg-inherit rounded-lg w-full">
              {Object.entries(nodeExpressions).map(([key, value]) => (
                <div key={key} className="relative flex items-center">
                  <h1
                    onClick={() => {
                      setAddExpression(false);
                      setEditExpression(true);
                      setExpression({
                        name: key.split("$")[1],
                        condition: value.condition,
                        value: value.value,
                      });
                    }}
                    className="underline text-indigo-600 italic hover:text-indigo-800 flex-grow cursor-pointer"
                  >
                    {key.split("$")[1]}
                  </h1>
                  <FaTrashAlt
                    id={key}
                    className="text-gray-500 hover:text-red-500 ml-2 cursor-pointer"
                    onClick={() => handleDeleteExpression(key)}
                  />
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-col justify-center">
            <button
              className={`bg-white font-semibold border rounded-md border-dashed p-1 ${
                addExpression || editExpression
                  ? "border-gray-600 text-gray-600 cursor-not-allowed"
                  : "border-blue-500 text-blue-500 hover:bg-blue-50"
              }`}
              disabled={addExpression || editExpression}
              onClick={() => {
                setAddExpression(true);
                setExpression({ name: "", condition: "", value: "" });
              }}
            >
              New Expression +
            </button>
          </div>
        </div>
      )}
      {(addExpression || editExpression) && (
        <div className="mt-6 p-4 space-y-4 border-gray-200 border-2 rounded-xl hover:border-gray-400">
          <p className="font-medium w-auto h-auto text-gray-800">
            {editExpression ? "Edit Expression" : "Add Expression"}
          </p>
          <div>
            <div className="flex flex-row space-x-1">
              <p className="mb-1 w-auto h-auto text-slate-500 flex flex-row">
                Expression Name
              </p>
              <span className="mt-auto mb-auto">
                <HiVariable />
              </span>
            </div>
            <Select
              isDisabled={editExpression}
              value={{ value: expression.name, label: expression.name }}
              onChange={handleExpressionNameChange}
              options={getExpressionOptions()}
            />
          </div>
          <div>
            <div className="flex flex-row space-x-1">
              <p className="w-auto h-auto text-slate-500 flex flex-row">
                Condition{" "}
              </p>
              <span className="mt-auto mb-auto">
                <TbMathFunction />
              </span>
            </div>
            <Select
              value={{
                value: expression.condition,
                label: expression.condition,
              }}
              onChange={handleExpressionConditionChange}
              options={conditionOptions}
            />
          </div>
          <div>
            <div className="flex flex-row space-x-1">
              <p className="w-auto h-auto text-slate-500 flex flex-row">
                Value{" "}
              </p>
              <span className="mt-auto mb-auto">
                <TbMathFunction />
              </span>
            </div>
            <Select
              value={{ value: expression.value, label: expression.value }}
              onChange={handleExpressionValueChange}
              options={getStatusOptions()}
            />
          </div>
          <div className="mt-2 flex p-1 space-x-2 rounded-xl">
            {addExpression && (
              <button
                className="bg-purple-500 text-white rounded-lg p-1 w-1/2 hover:bg-purple-600 transition-all duration-200 ease-in-out transform hover:scale-105"
                onClick={handleCreateExpression}
              >
                Create
              </button>
            )}
            {editExpression && (
              <button
                className="bg-purple-500 text-white rounded-lg p-1 w-1/2 hover:bg-purple-600 transition-all duration-200 ease-in-out transform hover:scale-105"
                onClick={handleEditExpression}
              >
                Save
              </button>
            )}
            <button
              className="bg-slate-400 text-white rounded-lg p-1 w-1/2 hover:bg-slate-500 transition-all duration-200 ease-in-out transform hover:scale-105"
              onClick={() => {
                setAddExpression(false);
                setEditExpression(false);
                setExpression({ name: "", condition: "", value: "" });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="mt-4 flex p-4 space-x-2 rounded-xl">
        <button
          className="bg-blue-500 text-white rounded-lg p-2 w-1/2 hover:bg-blue-600 transition-all duration-200 ease-in-out transform hover:scale-105"
          onClick={() => {
            console.log("Selected Node ----> ", selectedNode);
            setSelectedElements([]);
          }}
        >
          Save
        </button>
        <button
          className="bg-red-400 text-white rounded-lg p-2 w-1/2 hover:bg-red-500 transition-all duration-200 ease-in-out transform hover:scale-105"
          onClick={() => handleDelete(selectedNode?.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
