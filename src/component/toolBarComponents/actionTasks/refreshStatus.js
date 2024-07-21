import React from "react";
import { SlRefresh } from "react-icons/sl";
import { ImSpinner9 } from "react-icons/im";

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
      className={`p-2 text-gray-500 border-2 border-gray-500 bg-gray-50 rounded-full hover:text-indigo-500 hover:border-indigo-500 hover:scale-110 transition-all duration-300 ease-in-out  ${
        collapse ? "hidden" : ""
      } ${fetching ? "cursor-not-allowed" : "cursor-pointer"}`}
      title={`${fetching ? "Fetching.." : "Refresh"}`}
      onClick={fetching ? null : fetchCompletedTasks}
    >
      {fetching ? (
        <ImSpinner9 className="text-xl animate-spin text-indigo-500" />
      ) : (
        <SlRefresh className="text-xl font-bold" />
      )}
    </div>
  );
};

export default RefreshStatus;
