import React, { useEffect, useRef } from "react";

const SeatPopup = ({ position, seatId, onClose }) => {
  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      style={{ top: position.y + 10 + "px", left: position.x + 10 + "px" }}
      className="absolute z-10 scroll-smooth transition-all duration-300"
    >
      <div className="bg-amber-200 px-3 py-1 rounded-t-xl">Seat {seatId}</div>
      <div className="bg-white px-3 rounded-b-md text-blue-700 font-medium">
        1700/- Rs.
      </div>
    </div>
  );
};

export default SeatPopup;
