import React from "react";
const ExecuteFlow = ({
  collapse,
  starting,
  setStarting,
  setProcessInstanceId,
  processDefinitionKey,
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
            body: JSON.stringify({
              processKey: processDefinitionKey,
              name: "John Doe",
              amount : "100.00",
              loanNumber: "LN123456789",
              paymentLink: "https://example.com/payment?loan=LN123456789",
            }),
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
      className={` text-gray-500 hover:border-indigo-500 hover:scale-110 transition-all duration-300 ease-in-out  ${
        collapse ? "hidden" : ""
      } ${starting ? "cursor-not-allowed" : "cursor-pointer"}`}
      onClick={starting ? null : startProcess}
    >
      {starting ? (
        <button className="p-1 pl-2 pr-2 bg-blue-500 rounded-md text-white text-sm font-medium">
          Executing
        </button>
      ) : (
        <button className="p-1 pl-2 pr-2 bg-blue-500 rounded-md text-white text-sm font-medium">
          Execute
        </button>
      )}
    </div>
  );
};

export default ExecuteFlow;
