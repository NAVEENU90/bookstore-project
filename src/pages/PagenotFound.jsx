import React from "react";

const PagenotFound = () => {
  return (
    <>
      <div className="fade-in flex h-screen w-full items-center justify-center">
        <div className="md:grid grid-cols-3">
          <div></div>
          <div className="flex justify-center items-center flex-col p-5 md:p-0">
            <img src="https://www.airpearl.com/images/error-page.gif" alt="Page not found" />
            <p className="text-5xl font-normal">Oh No!</p>
            <h2 className="md:text-5xl text-2xl">Look Like You're Lost</h2>
            <h5 className="mt-3 text-lg font-normal">The page you are looking for is <span className="text-red-500">not available</span></h5>
            <button className="mt-4 px-4 py-3 bg-blue-800 text-white rounded hover:border hover:border-blue-800 hover:bg-white hover:text-blue-900">Back Home</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PagenotFound;
