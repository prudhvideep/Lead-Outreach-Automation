import React from "react";

const RefreshStatus = ({
  collapse,
  fetching,
  setFetching,
  processInstanceId,
  setCompletedTasks,
}) => {
  const fetchCompletedTasks = async () => {
    if (!processInstanceId) return;
    setFetching(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_FLOWABLE_BASE_URL}/monitorProcess/${processInstanceId}/completedTasks`
      );
      const completedTasks = await response.json();
      setCompletedTasks(completedTasks);
      setFetching(false);
    } catch (error) {
      setFetching(false);
      console.error("Error fetching completed tasks: ", error);
    }
  };

  return (
    <div
      className={` text-gray-500 hover:scale-110 transition-all duration-300 ease-in-out  ${
        collapse ? "hidden" : ""
      } ${fetching ? "cursor-not-allowed" : "cursor-pointer"}`}
      onClick={fetching ? null : fetchCompletedTasks}
    >
      {fetching ? (
        <button className="p-1 pl-2 pr-2 bg-blue-500 rounded-md text-white text-sm font-medium">
          Fetching
        </button>
      ) : (
        <button className="p-1 pl-2 pr-2 bg-blue-500 rounded-md text-white text-sm font-medium">
          Refresh
        </button>
      )}
    </div>
  );
};

export default RefreshStatus;
