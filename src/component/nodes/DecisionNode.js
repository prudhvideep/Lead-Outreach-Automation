import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { TbArrowsSplit } from "react-icons/tb";

function DecisionNode({ data, selected }) {
  const [conditions, setConditions] = useState(
    Object.keys(data.expressions).length > 0
      ? Object.entries(data.expressions).map(([key, value]) => ({
          field: key,
          operator: value.condition,
          value: value.value,
        }))
      : [{ field: "", operator: "", value: "" }]
  );

  const updateExpressions = (newConditions) => {
    if (selected && data.onExpressionChange) {
      const expressionsObject = newConditions.reduce((acc, condition) => {
        if (condition.field && condition.operator && condition.value) {
          acc[condition.field] = {
            condition: condition.operator,
            value: condition.value,
          };
        }
        return acc;
      }, {});
      data.onExpressionChange(expressionsObject);
    }
  };

  const addCondition = () => {
    const newConditions = [
      ...conditions,
      { field: "", operator: "", value: "" },
    ];
    setConditions(newConditions);
    updateExpressions(newConditions);
  };

  const removeCondition = (index) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    setConditions(newConditions);
    updateExpressions(newConditions);
  };

  const updateCondition = (index, field, value) => {
    const updatedConditions = conditions.map((condition, i) =>
      i === index ? { ...condition, [field]: value } : condition
    );
    setConditions(updatedConditions);
    updateExpressions(updatedConditions);
  };

  const conditionOptions = ["==", "!="];
  const expressionOptions = [
    "messageStatus",
    "callStatus",
    "emailStatus",
    "paymentStatus",
  ];

  return (
    <div
      className={`relative shadow-xl bg-gray-800 outline-dashed text-white p-2 rounded-lg transition-all duration-200 ease-in-out ${
        selected ? " outline-orange-500" : "outline-gray-500"
      }`}
    >
      <div className="flex flex-row items-center space-x-2 mb-2 text-orange-500">
        <TbArrowsSplit className="text-lg font-bold" />
        <p className="text-md font-semibold">If-Else</p>
      </div>
      <div className="space-y-3">
        {conditions.map((condition, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="flex items-center space-x-2 mb-2">
              <select
                className="bg-gray-700 rounded px-2 py-1 text-sm"
                value={condition.field}
                onChange={(e) =>
                  updateCondition(index, "field", e.target.value)
                }
              >
                <option value="">Select field</option>
                {expressionOptions.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <select
                className="bg-gray-700 rounded px-2 py-1 text-sm"
                value={condition.operator}
                onChange={(e) =>
                  updateCondition(index, "operator", e.target.value)
                }
              >
                <option value="">Select operator</option>
                {conditionOptions.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="bg-gray-700 rounded px-2 py-1 text-sm "
                placeholder="Value"
                value={condition.value}
                onChange={(e) =>
                  updateCondition(index, "value", e.target.value)
                }
              />
              <button
                onClick={() => removeCondition(index)}
                className="text-red-500 text-sm hover:text-red-700"
              >
                ✕
              </button>
            </div>
            {index < conditions.length - 1 && (
              <div>
                <select className="bg-gray-700 rounded px-2 py-1 text-sm">
                  <option>And</option>
                  <option>Or</option>
                </select>
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={addCondition}
        className="border-2 w-full p-1 rounded-lg mt-2 text-sm text-gray-300 hover:text-blue-500 hover:bg-slate-900 hover:border-blue-700"
      >
        Add Condition
      </button>

      <Handle
        type="target"
        id="a"
        position={Position.Top}
        className="absolute -top-5 w-3 h-3 rounded-full bg-gray-700 border border-gray-500"
      />
      <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 flex items-center">
        <Handle
          type="source"
          id="yes"
          position={Position.Right}
          className="w-3 h-3 rounded-full bg-gray-700 border border-gray-500"
        />
        <span className="text-sm font-medium text-gray-300 translate-x-2 translate-y-5">
          {data.yesLabel || "Yes"}
        </span>
      </div>
      <div className="absolute bottom-3 left-1/2 transform translate-y-full -translate-x-1/2 flex items-center">
        <Handle
          type="source"
          id = "no"
          position={Position.Bottom}
          className="w-3 h-3 rounded-full bg-gray-700 border border-gray-500"
        />
        <span className="mt-2 text-sm font-medium text-gray-300 translate-x-6 translate-y-2">
          {data.noLabel || "No"}
        </span>
      </div>
    </div>
  );
}

export default DecisionNode;
