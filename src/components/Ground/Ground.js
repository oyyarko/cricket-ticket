import React, { useCallback, useRef, useState } from "react";
import { Arc, Circle, Group, Layer, Rect, Stage, Text } from "../../imports";
import SeatsArrangement from "../Seat/Seat";
import {
  SEAT_COLUMNS_DISTANCE,
  SEAT_ROWS_DISTANCE,
  SEAT_SIZE,
  SEATS_DISTANCE,
} from "../../config/layout";
import SeatPopup from "../Seat/SeatPopup";

const Ground = () => {
  const stageRef = useRef();
  const groupRef = useRef();
  const containerRef = useRef(null);
  const blockArcRefs = useRef([]);
  const width = window.innerWidth;
  const height = window.innerHeight;

  const [popup, setPopup] = useState({ seat: null });
  const [matrices, setMatrices] = useState(
    Array(10)
      .fill()
      .map(() => Array(6).fill(0))
  );

  const handleSeatHover = useCallback((seat, pos) => {
    setPopup({
      seat: seat,
      position: pos,
    });
  }, []);

  const [selectedBlock, setSelectedBlock] = useState({
    state: false,
    id: null,
  });

  const outerSlices = [
    { id: 1, angle: 0, block: "A" },
    { id: 2, angle: 45, block: "B" },
    { id: 3, angle: 90, block: "C" },
    { id: 4, angle: 135, block: "D" },
    { id: 5, angle: 180, block: "E" },
    { id: 6, angle: 225, block: "F" },
    { id: 7, angle: 270, block: "G" },
    { id: 8, angle: 315, block: "H" },
  ];

  const innerSlices = [
    { id: 9, angle: 22.5, block: "I" },
    { id: 10, angle: 67.5, block: "J" },
    { id: 11, angle: 112.5, block: "K" },
    { id: 12, angle: 157.5, block: "L" },
    { id: 13, angle: 202.5, block: "M" },
    { id: 14, angle: 247.5, block: "N" },
    { id: 15, angle: 292.5, block: "O" },
    { id: 16, angle: 337.5, block: "P" },
  ];

  const outerRadius = 400;
  const outerInnerRadius = 250;
  const innerRadius = 250;
  const innerInnerRadius = 150;

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
            // <SeatsArrangement rows={10} cols={7} />
            <Group>
              {matrices.map((rows, index) => {
                return rows.map((row, id) => (
                  <>
                    <Circle
                      key={index}
                      x={
                        width / 2 + SEAT_COLUMNS_DISTANCE * id + SEATS_DISTANCE
                      }
                      y={
                        height / 2 + SEAT_ROWS_DISTANCE * index + SEATS_DISTANCE
                      }
                      radius={SEAT_SIZE}
                      fill={
                        row === 1
                          ? "#3d65ad"
                          : row === 2
                          ? "#aba9a9"
                          : "#e6ebf2"
                      }
                      stroke={
                        row === 1
                          ? "#0e336e"
                          : row === 2
                          ? "#3333332b"
                          : "#979899"
                      }
                      strokeWidth={1}
                      listening={true}
                      onMouseEnter={(e) => {
                        e.target._clearCache();
                        console.log(
                          "e.target :>> ",
                          e.target,
                          e.target.getAbsolutePosition()
                        );
                        handleSeatHover(
                          index + "-" + id,
                          e.target.getAbsolutePosition()
                        );
                      }}
                    />
                  </>
                ));
              })}
            </Group>
          ) : (
            <Group ref={groupRef}>
              {outerSlices.map((slice, index) => {
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
                        setSelectedBlock({ state: true, id: slice.id });
                      }}
                      onTap={(e) => {
                        setSelectedBlock({ state: true, id: slice.id });
                      }}
                    />
                    <Text
                      text={slice.block}
                      x={x - 20}
                      y={y - 10}
                      fontSize={24}
                      fill="black"
                      fontFamily="Rubik"
                    />
                  </Group>
                );
              })}
              {innerSlices.map((slice, index) => {
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
                        setSelectedBlock({ state: true, id: slice.id });
                      }}
                      onTap={(e) => {
                        setSelectedBlock({ state: true, id: slice.id });
                      }}
                    />
                    <Text
                      text={slice.block}
                      x={x - 20}
                      y={y - 10}
                      fontSize={24}
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
