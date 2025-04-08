import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <ProgressSpinner style={{ width: "60px", height: "60px" }} />
        <p className="mt-4 text-lg font-semibold text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;