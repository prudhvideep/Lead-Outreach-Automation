import { useEffect, useState } from "react";
import { IoFolderOpen } from "react-icons/io5";
import { useReactFlow } from "reactflow";

const FlowModal = ({ setNodes, setEdges, setShowModal, reactFlowInstance, setFlowName }) => {
  const [results, setResults] = useState([]);
  const { setViewport } = useReactFlow();


  const handleClick = async (result) => {
    console.log(result)
    const flow = JSON.parse(localStorage.getItem(result));
    if (flow) {
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      setViewport({ x, y, zoom });
      setFlowName(result)
    }

    setShowModal(false);
  };

  useEffect(() => {
    let elements = Object.keys(localStorage).filter(
      (key) => key.includes("flow") || key.includes("Flow")
    );
    setResults(elements);
  }, []);

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-zinc-700 rounded-xl w-1/2 h-1/2">
        <div className="relative p-3 flex flex-row items-center gap-2">
          <IoFolderOpen className="text-zinc-400 text-xl" />
          <p className="font-medium text-zinc-400">Open flow</p>
          <input
            placeholder="Search Existing Flows"
            className="absolute left-1/4 p-1 w-1/2 pl-4 text-black rounded-md bg-zinc-400 outline-none placeholder:text-slate-700"
          ></input>
        </div>
        <div className="mt-1 h-3/4 overflow-y-auto">
          <div className="flex flex-col hover:cursor-pointer">
            {results.map((result, index) => (
              <div
                key={index}
                onClick={() => handleClick(result)}
                className="p-3 border-t border-zinc-500 hover:bg-zinc-600"
              >
                <p>{result}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="p-1 relative flex flex-row items-end justify-end gap-2">
          <button
            onClick={() => setShowModal(false)}
            className="mr-2 p-1 pl-2 pr-2 rounded-lg bg-zinc-600 hover:bg-zinc-500 hover:shadow-md text-zinc-300 text-sm font-medium border-2 border-zinc-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlowModal;
