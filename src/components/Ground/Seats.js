import React, { useCallback, useEffect, useRef, useState } from "react";
import { Arc, Circle, Group, Layer, Rect, Stage, Text } from "../../imports";
import {
  SEAT_COLUMNS_DISTANCE,
  SEAT_ROWS_DISTANCE,
  SEAT_SIZE,
  SEATS_DISTANCE,
} from "../../config/layout";
import SeatPopup from "../Seat/SeatPopup";
import { useSelector } from "react-redux";

const Ground = () => {
  const stageRef = useRef();
  const groupRef = useRef();
  const containerRef = useRef(null);
  const blockArcRefs = useRef([]);
  const width = window.innerWidth;
  const height = window.innerHeight;

  const outerRadius = 400;
  const outerInnerRadius = 250;
  const innerRadius = 250;
  const innerInnerRadius = 150;

  const { blocks } = useSelector((state) => state.ground);
  const [popup, setPopup] = useState({ seat: null });
  const [matrices, setMatrices] = useState(null); // 0: empty, 1: taken, 2: user-selected
  const [selectedBlock, setSelectedBlock] = useState({
    state: false,
    id: null,
  });
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    if (blocks?.length) {
      const block = blocks?.find(
        (selected) => selected._id === selectedBlock.id
      );
      setMatrices(
        Array(block?.colsCount)
          .fill()
          .map(() => Array(block?.rowsCount).fill(0))
      );
    }
  }, [selectedBlock]);

  console.log("matrices :>> ", matrices);

  useEffect(() => {
    setSelectedSeats(
      matrices?.reduce((acc, row, i) => {
        row.forEach((value, j) => {
          if (value === 2) {
            acc.push([i, j]);
          }
        });
        return acc;
      }, [])
    );
  }, [matrices]);

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
        position: "relative",
        backgroundColor: "lightgrey",
        width: "100vw",
        height: "100vh",
      }}
      ref={containerRef}
    >
      <Stage width={width} height={height} ref={stageRef} onWheel={handleWheel}>
        <Layer>
          {selectedBlock.state ? (
            <Group draggable>
              <Text
                text={"Go back"}
                x={width / 2 + 45}
                y={height / 2 - 40}
                fontSize={24}
                fill="black"
                fontFamily="Rubik"
                onClick={() => setSelectedBlock({ state: false, id: null })}
              />
              {matrices?.map((rows, rowIndexTop) => {
                return rows.map((row, colIndexTop) => (
                  <>
                    <Circle
                      key={rowIndexTop}
                      x={
                        width / 2 +
                        SEAT_COLUMNS_DISTANCE * colIndexTop +
                        SEATS_DISTANCE
                      }
                      y={
                        height / 2 +
                        SEAT_ROWS_DISTANCE * rowIndexTop +
                        SEATS_DISTANCE
                      }
                      radius={SEAT_SIZE}
                      fill={
                        row === 1
                          ? "#ebe8e8"
                          : row === 2
                          ? "#bf3e32"
                          : "#5481c7"
                      }
                      stroke={
                        row === 1
                          ? "#858282"
                          : row === 2
                          ? "#781810"
                          : "#325b99"
                      }
                      strokeWidth={1}
                      listening={true}
                      onClick={() => {
                        setMatrices((prev) => {
                          return prev.map((row, rowIndex) =>
                            rowIndex === rowIndexTop
                              ? row.map((cell, colIndex) =>
                                  colIndex === colIndexTop
                                    ? cell === 2
                                      ? 0
                                      : 2
                                    : cell
                                )
                              : row
                          );
                        });
                      }}
                      onMouseEnter={(e) => {
                        e.target._clearCache();
                        handleSeatHover(
                          rowIndexTop + "-" + colIndexTop,
                          e.target.getAbsolutePosition()
                        );
                      }}
                    />
                  </>
                ));
              })}
              <Text
                text={"Pitch this way"}
                x={width / 2 + 50}
                y={height / 2 + 320}
                fontSize={14}
                fill="black"
                align="center"
                verticalAlign="middle"
                fontFamily="Rubik"
              />
            </Group>
          ) : (
            <Group ref={groupRef}>
              {blocks
                ?.filter((block) => block.level !== 2)
                .map((slice, index) => {
                  const { x, y } = getLabelPosition(
                    (outerRadius + outerInnerRadius) / 2,
                    slice.angle + 22.5
                  );
                  return (
                    <Group key={slice.id}>
                      <Arc
                        key={`outer-${index}`}
                        x={width / 2}
                        y={height / 2}
                        innerRadius={outerInnerRadius}
                        outerRadius={outerRadius}
                        angle={45}
                        rotation={slice.angle}
                        fill={"#abd1ff"}
                        stroke="#aabbf2"
                        opacity={0.8}
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
                          setSelectedBlock({ state: true, id: slice._id });
                        }}
                        onTap={(e) => {
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
              {blocks
                ?.filter((block) => block.level !== 1)
                .map((slice, index) => {
                  const { x, y } = getLabelPosition(
                    (innerRadius + innerInnerRadius) / 2,
                    slice.angle + 22.5
                  );
                  return (
                    <Group
                      key={slice.id}
                      ref={(ref) => (blockArcRefs.current[slice.id] = ref)}
                    >
                      <Arc
                        key={`inner-${index}`}
                        x={width / 2}
                        y={height / 2}
                        innerRadius={innerInnerRadius}
                        outerRadius={innerRadius}
                        angle={45}
                        rotation={slice.angle}
                        fill={"#ddfab9"}
                        stroke="#aef0ad"
                        opacity={0.8}
                        strokeWidth={1}
                        listening={true}
                        onMouseEnter={(e) => {
                          e.target._clearCache();
                          const container = e.target.getStage().container();
                          container.style.cursor = "pointer";
                        }}
                        onClick={(e) => {
                          e.target._clearCache();
                          setSelectedBlock({ state: true, id: slice._id });
                        }}
                        onTap={(e) => {
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
                    // props.onHover(null);
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
          seatId={popup.seat}
          onClose={() => {
            setPopup({ seat: null });
          }}
        />
      )}
    </div>
  );
};

export default Ground;
