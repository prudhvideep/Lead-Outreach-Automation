import React, { useRef, useEffect } from "react";
import { FaAngleRight, FaChevronDown } from "react-icons/fa";
import ReactDOM from "react-dom";

const NodeSection = ({
  title,
  nodes,
  expanded,
  setExpanded,
  onDragStart,
  onDragEnd,
}) => {
  const dragItemsRef = useRef({});

  useEffect(() => {
    nodes.forEach((node) => {
      const div = document.createElement("div");
      div.className = "draggable-ghost";
      div.style.pointerEvents = 'none';
      document.body.appendChild(div);

      ReactDOM.render(
        <div className="p-2 w-32 flex items-center justify-center space-x-2 bg-black rounded-lg text-[8px]">
          <div className={`text-${node.color}-${node.shade} text-sm `}>
            {node.icon}
          </div>
          <span className="text-xs font-normal text-gray-300">
            {node.label}
          </span>
        </div>,
        div
      );

      dragItemsRef.current[node.type] = div;
    });

    return () => {
      Object.values(dragItemsRef.current).forEach((div) => {
        ReactDOM.unmountComponentAtNode(div);
        document.body.removeChild(div);
      });
    };
  }, [nodes]);

  const handleDragStart = (event, node) => {
    const ghostElement = dragItemsRef.current[node.type];
    if (ghostElement) {
      event.dataTransfer.setDragImage(ghostElement, 1, 0);
    }
    onDragStart(event, node.type, node.nodeActionType);
    event.target.style.opacity = "1";
  };

  const handleDragEnd = (event) => {
    event.target.style.opacity = "1";
    onDragEnd();
  };

  return (
    <div
      className={`mt-4 bg-customgray border border-gray-700 rounded-xl shadow-md`}
    >
      <div
        className={`p-3 flex items-center space-x-2 hover:cursor-pointer hover:bg-highlightedgray ${
          expanded ? "hover:rounded-t-xl" : "hover:rounded-xl"
        } `}
        onClick={() => setExpanded(!expanded)}
      >
        <button>
          {expanded ? (
            <FaChevronDown className="text-gray-300 text-[10px]" />
          ) : (
            <FaAngleRight className="text-gray-300 text-[10px]" />
          )}
        </button>
        <h3 className="font-normal text-xs text-gray-300">{title}</h3>
      </div>

      {expanded && (
        <div
          className={`transition-transform duration-300 ease-in-out ${
            !expanded ? "hide" : ""
          } p-2 grid grid-cols-2 grid-row-auto gap-3`}
        >
          {nodes.map((node) => (
            <div
              key={node.type}
              className={`p-2 flex items-center justify-center space-x-2 bg-black rounded-lg shadow-sm cursor-grab text-[8px] outline outline-black hover:outline-blue-700 `}
              onDragStart={(event) => handleDragStart(event, node)}
              onDragEnd={handleDragEnd}
              draggable
            >
              <div className={`text-${node.color}-${node.shade} text-sm`}>
                {node.icon}
              </div>
              <span className="text-xs font-normal text-gray-300">
                {node.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NodeSection;
