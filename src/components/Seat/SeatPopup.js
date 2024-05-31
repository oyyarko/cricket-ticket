import React, { useEffect, useRef } from "react";

const SeatPopup = ({ position, seatId, onClose }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      //   if (!isClickedInside(e, containerRef.current)) {
      //     onClose();
      //   }
      console.log("clicked inside");
    };
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("click", onClick);
    };
  }, []);
  
  console.log("here")
  return (
    <div
      ref={containerRef}
      style={{ top: position.y + 20 + "px", left: position.x + 20 + "px" }}
      className="absolute p-4 rounded-sm z-10 bg-white"
    >
      <div>Seat {seatId}</div>
    </div>
  );
};

export default SeatPopup;
