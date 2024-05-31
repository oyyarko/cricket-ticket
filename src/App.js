import React from "react";
import Ground from "./components/Ground/Ground";

const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center max-sm:p-4">
      <div className="text-center">
        <h1 className="text-indigo-600 font-semibold text-2xl">Cricket ticket booking app</h1>
        <Ground />
        {/* <SeatBooking /> */}
      </div>
    </div>
  );
};

export default App;
