import React, { useRef } from "react";
import useOutsideClick from "../../hooks/useOutsideClick";

const SeatPopup = ({ position, seat, onClose }) => {
  const containerRef = useRef(null);

  useOutsideClick(containerRef, onClose)

  return (
    <div
      ref={containerRef}
      style={{ top: position.y + 10 + "px", left: position.x + 10 + "px" }}
      className="absolute z-10 scroll-smooth transition-all duration-300"
    >
      <div className="bg-amber-200 px-3 py-1 rounded-t-xl">
        Seat {seat.row + "-" + seat.col}
      </div>
      <div className="bg-white px-3 rounded-b-md text-blue-700 font-medium">
        {seat.price}/- Rs.
      </div>
    </div>
  );
};

export default SeatPopup;
