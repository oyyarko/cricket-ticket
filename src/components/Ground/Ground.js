import React, { useCallback, useEffect, useRef, useState } from "react";
import { Arc, Circle, Group, Layer, Rect, Stage, Text } from "../../imports";
import {
  SEAT_COLUMNS_DISTANCE,
  SEAT_ROWS_DISTANCE,
  SEAT_SIZE,
  SEATS_DISTANCE,
} from "../../config/layout";
import SeatPopup from "../Seat/SeatPopup";
import { useDispatch, useSelector } from "react-redux";
import { fetchSeatsByBlock, selectSeats } from "../../redux/groundSlice";

const legends = [
  { id: 1, label: "Available", color: "#5481c7" },
  { id: 2, label: "Taken", color: "#ebe8e8" },
  { id: 3, label: "Selected", color: "#bf3e32" },
  { id: 4, label: "Not available", color: "#ccc" },
];

const Ground = () => {
  const stageRef = useRef();
  const groupRef = useRef();
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const width = window.innerWidth;
  const height = window.innerHeight;

  const outerRadius = 400;
  const outerInnerRadius = 250;
  const innerRadius = 250;
  const innerInnerRadius = 150;

  const { blocks, seats } = useSelector((state) => state.ground);
  const [popup, setPopup] = useState({ seat: null });
  const [matrices, setMatrices] = useState(null); // 0: empty, 1: taken, 2: user-selected
  const [selectedBlock, setSelectedBlock] = useState({
    state: false,
    id: null,
  });
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    setSelectedSeats(
      matrices?.reduce((acc, row, i) => {
        row.forEach((value, j) => {
          if (value.status === 2) {
            acc.push([i + 1, j + 1]);
          }
        });
        return acc;
      }, [])
    );
  }, [matrices]);

  useEffect(() => {
    setMatrices(seats);
  }, [seats]);

  const handleSeatHover = useCallback((seat, pos) => {
    setPopup({
      seat: seat,
      position: pos,
    });
  }, []);

  const getLabelPosition = (radius, angle) => {
    const radian = (Math.PI / 180) * angle;
    return {
      x: width / 2 + radius * Math.cos(radian),
      y: height / 2 + radius * Math.sin(radian),
    };
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();

    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const scaleBy = 1.1;
    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    stage.scale({ x: newScale, y: newScale });
    // stage.scale({ x: oldScale, y: oldScale });

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    stage.position(newPos);
    stage.batchDraw();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#eee",
        width: "100vw",
        height: "100vh",
      }}
      ref={containerRef}
    >
      {selectedBlock.state ? (
        <>
          <div className="absolute flex flex-row p-3 justify-around min-w-full bg-amber-200 items-center z-10 top-0">
            <div
              className="cursor-pointer border-b border-b-black border-dashed hover:bg-black hover:text-white p-2 px-6 hover:rounded-full transition-all duration-100"
              onClick={() => setSelectedBlock({ state: false, id: null })}
            >
              Go back
            </div>
            <button
              disabled={!selectedSeats?.length}
              type="submit"
              className="bg-black text-white rounded-full p-2 px-6 shadow-2xl disabled:opacity-40"
              onClick={() =>
                dispatch(
                  selectSeats({
                    blockId: selectedBlock.id,
                    seats: selectedSeats,
                    cb: () => setSelectedBlock({ state: false, id: null }),
                  })
                )
              }
            >
              Book selected tickets
            </button>
          </div>
          <div className="absolute top-24 flex flex-row p-3 justify-center gap-6 rounded-full border-b-zinc-300 shadow-2xl border-b-2 px-6">
            {legends.map((leg) => (
              <div
                key={leg.id}
                className="flex items-center gap-3 border-r border-r-slate-300 pe-10 last-of-type:border-r-0 last-of-type:pe-0"
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ background: leg.color }}
                ></div>
                {leg.label}
              </div>
            ))}
          </div>
        </>
      ) : null}
      <Stage width={width} height={height} ref={stageRef} onWheel={handleWheel}>
        <Layer>
          {selectedBlock.state ? (
            <Group draggable>
              {matrices?.map((rows, rowIndexTop) => {
                return rows.map((row, colIndexTop) => (
                  <>
                    <Circle
                      key={rowIndexTop}
                      x={
                        width / 2 +
                        SEAT_COLUMNS_DISTANCE * rowIndexTop +
                        SEATS_DISTANCE
                      }
                      y={
                        height / 2 +
                        SEAT_ROWS_DISTANCE * colIndexTop +
                        SEATS_DISTANCE
                      }
                      radius={SEAT_SIZE}
                      fill={
                        row.status === 1
                          ? "#ebe8e8"
                          : row.status === 2
                          ? "#bf3e32"
                          : row.status === 3
                          ? "#ccc"
                          : "#5481c7"
                      }
                      stroke={
                        row.status === 1
                          ? "#858282"
                          : row.status === 2
                          ? "#781810"
                          : row.status === 3
                          ? "#3333332b"
                          : "#325b99"
                      }
                      strokeWidth={1}
                      listening={
                        row.status == 1 || row.status == 3 ? false : true
                      }
                      onClick={() => {
                        setMatrices((prevSeats) =>
                          prevSeats.map((row, rowIndex) =>
                            rowIndex === rowIndexTop
                              ? row.map((seat, colIndex) =>
                                  colIndex === colIndexTop
                                    ? {
                                        ...seat,
                                        status: seat.status === 2 ? 0 : 2,
                                      }
                                    : seat
                                )
                              : row
                          )
                        );
                      }}
                      onMouseEnter={(e) => {
                        e.target._clearCache();
                        handleSeatHover(row, e.target.getAbsolutePosition());
                      }}
                    />
                  </>
                ));
              })}
            </Group>
          ) : (
            <Group draggable ref={groupRef}>
              {blocks?.map((slice, index) => {
                const { x, y } = getLabelPosition(
                  slice.level === 1
                    ? (outerRadius + outerInnerRadius) / 2
                    : (innerRadius + innerInnerRadius) / 2,
                  slice.angle + 22.5
                );
                return (
                  <Group key={slice._id}>
                    <Arc
                      key={`outer-${index}`}
                      x={width / 2}
                      y={height / 2}
                      innerRadius={
                        slice.level === 1 ? outerInnerRadius : innerInnerRadius
                      }
                      outerRadius={
                        slice.level === 1 ? outerRadius : innerRadius
                      }
                      angle={45}
                      rotation={slice.angle}
                      fill={slice.level === 2 ? "#ddfab9" : "#abd1ff"}
                      stroke="#aabbf2"
                      opacity={0.4}
                      strokeWidth={1}
                      listening={true}
                      onMouseEnter={(e) => {
                        e.target._clearCache();
                        const container = e.target.getStage().container();
                        container.style.cursor = "pointer";
                      }}
                      onMouseLeave={(e) => {
                        const container = e.target.getStage().container();
                        container.style.cursor = "";
                      }}
                      onClick={(e) => {
                        e.target._clearCache();
                        dispatch(fetchSeatsByBlock(slice._id));
                        setSelectedBlock({ state: true, id: slice._id });
                      }}
                      onTap={(e) => {
                        dispatch(fetchSeatsByBlock(slice._id));
                        setSelectedBlock({ state: true, id: slice._id });
                      }}
                    />
                    <Text
                      text={slice.name}
                      x={x - 20}
                      y={y - 10}
                      fontSize={16}
                      fill="black"
                      fontFamily="Rubik"
                    />
                  </Group>
                );
              })}
              <>
                <Circle
                  x={width / 2}
                  y={height / 2}
                  radius={150}
                  fill="#5d995c"
                  listening={true}
                  onMouseEnter={(e) => {
                    e.target._clearCache();
                    const container = e.target.getStage().container();
                    container.style.cursor = "pointer";
                  }}
                  onMouseLeave={(e) => {
                    const container = e.target.getStage().container();
                    container.style.cursor = "";
                  }}
                  onClick={(e) => {}}
                  onTap={(e) => {}}
                />
                <Rect
                  x={width / 2 - 15}
                  y={height / 2 - 40}
                  width={width / 60}
                  height={height / 10}
                  fill="#bfc7bf"
                  strokeWidth={1}
                  stroke="#bfc7bf"
                  cornerRadius={2}
                />
                <Text
                  text={"Pitch this way"}
                  x={width / 2 - 40}
                  y={height / 2 - 70}
                  fontSize={14}
                  fill="white"
                  align="center"
                  verticalAlign="middle"
                  fontFamily="Rubik"
                />
              </>
            </Group>
          )}
        </Layer>
      </Stage>
      {popup.seat && (
        <SeatPopup
          position={popup.position}
          seat={popup.seat}
          onClose={() => {
            setPopup({ seat: null });
          }}
        />
      )}
    </div>
  );
};

export default Ground;
