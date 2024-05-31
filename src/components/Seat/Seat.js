import { useCallback, useState } from "react";
import { Circle, Group } from "../../imports";
import {
  SEAT_COLUMNS_DISTANCE,
  SEAT_ROWS_DISTANCE,
  SEAT_SIZE,
  SEATS_DISTANCE,
} from "../../config/layout";
import SeatPopup from "./SeatPopup";

const SeatsArrangement = ({ rows = 10, columns = 6 }) => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const [popup, setPopup] = useState({ seat: null });
  const [matrices, setMatrices] = useState(
    Array(rows)
      .fill()
      .map(() => Array(columns).fill(0))
  );

  const handleSeatHover = useCallback((seat, pos) => {
    setPopup({
      seat: seat,
      position: pos,
    });
  }, []);

  console.log('popup :>> ', popup);

  return (
    <Group>
      {matrices.map((rows, index) => {
        return rows.map((row, id) => (
          <>
            <Circle
              key={index}
              x={width / 2 + SEAT_COLUMNS_DISTANCE * id + SEATS_DISTANCE}
              y={height / 2 + SEAT_ROWS_DISTANCE * index + SEATS_DISTANCE}
              radius={SEAT_SIZE}
              fill={row === 1 ? "#3d65ad" : row === 2 ? "#aba9a9" : "#e6ebf2"}
              stroke={
                row === 1 ? "#0e336e" : row === 2 ? "#3333332b" : "#979899"
              }
              strokeWidth={1}
              listening={true}
              onMouseEnter={(e) => {
                e.target._clearCache();
                console.log('e.target :>> ', e.target, e.target.getAbsolutePosition());
                handleSeatHover(
                  index + "-" + id,
                  e.target.getAbsolutePosition()
                );
              }}
            />
          </>
        ));
      })}
      {popup.seat && (
        <SeatPopup
          position={popup.position}
          seatId={popup.seat}
          onClose={() => {
            setPopup({ seat: null });
          }}
        />
      )}
    </Group>
  );
};

export default SeatsArrangement;
