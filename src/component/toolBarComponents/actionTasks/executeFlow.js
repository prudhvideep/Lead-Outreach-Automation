import React from "react";
import { GoGear } from "react-icons/go";
import { ImSpinner } from "react-icons/im";

const ExecuteFlow = ({
  collapse,
  starting,
  setStarting,
  processInstanceId,
  setProcessInstanceId,
  processDefinitionKey,
  setProcessDefinitionKey,
}) => {
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

  return (
    <div
      className={`p-2 text-gray-500 border-2 border-gray-500 bg-gray-50 rounded-full hover:text-indigo-500 hover:border-indigo-500 hover:scale-110 transition-all duration-300 ease-in-out  ${
        collapse ? "hidden" : ""
      } ${starting ? "cursor-not-allowed" : "cursor-pointer"}`}
      title={starting ? "Executing..." : "Execute Flow"}
      onClick={starting ? null : startProcess}
    >
      {starting ? (
        <ImSpinner className="text-xl animate-spin text-indigo-500" />
      ) : (
        <GoGear className="text-xl" />
      )}
    </div>
  );
};

export default ExecuteFlow;
