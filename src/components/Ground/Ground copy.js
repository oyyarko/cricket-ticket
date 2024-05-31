import React, { useEffect, useRef, useState } from "react";
import { Arc, Circle, Group, Layer, Rect, Stage, Text } from "../../imports";
// import { Stage, Layer, Rect, Text, Arc, Circle, Group } from "react-konva";
import * as layout from "../../config/layout";

const Ground = () => {
  const stageRef = useRef();
  const containerRef = useRef(null);
  const blockArcRefs = useRef([]);
  const width = window.innerWidth;
  const height = window.innerHeight;

  const [hoveredSlice, setHoveredSlice] = useState(null);

  const outerSlices = [
    { id: 1, angle: 0, color: "red", block: "A" },
    { id: 2, angle: 45, color: "green", block: "B" },
    { id: 3, angle: 90, color: "blue", block: "C" },
    { id: 4, angle: 135, color: "yellow", block: "D" },
    { id: 5, angle: 180, color: "purple", block: "E" },
    { id: 6, angle: 225, color: "orange", block: "F" },
    { id: 7, angle: 270, color: "cyan", block: "G" },
    { id: 8, angle: 315, color: "magenta", block: "H" },
  ];

  const innerSlices = [
    { id: 9, angle: 22.5, color: "pink", block: "I" },
    { id: 10, angle: 67.5, color: "lightgreen", block: "J" },
    { id: 11, angle: 112.5, color: "lightblue", block: "K" },
    { id: 12, angle: 157.5, color: "lightyellow", block: "L" },
    { id: 13, angle: 202.5, color: "lavender", block: "M" },
    { id: 14, angle: 247.5, color: "", block: "N" },
    { id: 15, angle: 292.5, color: "lightcyan", block: "O" },
    { id: 16, angle: 337.5, color: "lightcoral", block: "P" },
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

  // useEffect(() => {
  //   outerSlices?.map((slice, index) => {
  //     if (blockArcRefs[slice.id]?.shift()?.current) {
  //       blockArcRefs[slice.id]
  //         ?.shift()
  //         ?.current.addEventListener(
  //           "click",
  //           console.log("outerSlices ref clicked")
  //         );
  //       return () => {
  //         blockArcRefs[slice.id]
  //           ?.shift()
  //           ?.current.removeEventListener(
  //             "click",
  //             console.log("outerSlices ref removed")
  //           );
  //       };
  //     }
  //   });
  //   innerSlices?.map((slice, index) => {
  //     if (blockArcRefs[slice.id]?.shift()?.current) {
  //       console.log("meow")
  //       blockArcRefs[slice.id]
  //         ?.shift()
  //         ?.current.addEventListener(
  //           "click",
  //           console.log("innerSlices ref clicked")
  //         );
  //       return () => {
  //         blockArcRefs[slice.id]
  //           ?.shift()
  //           ?.current.removeEventListener(
  //             "click",
  //             console.log("innerSlices ref removed")
  //           );
  //       };
  //     }
  //   });
  // }, []);

  const handleClick = (id) => {
    alert("Rect clicked!", id);
    // Do whatever you want when the rect is clicked
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
      <Stage width={width} height={height} ref={stageRef} scaleX={1} scaleY={1}>
        <Layer>
          {/* <Group> */}
          {outerSlices.map((slice, index) => {
            const { x, y } = getLabelPosition(
              (outerRadius + outerInnerRadius) / 2,
              slice.angle + 22.5
            );
            return (
              <Group key={slice.id} onClick={() => handleClick(slice.id)}>
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
                    console.log("e hover :>> ", e);
                    container.style.cursor = "pointer";
                  }}
                  onMouseLeave={(e) => {
                    // props.onHover(null);
                    const container = e.target.getStage().container();
                    container.style.cursor = "";
                  }}
                  onClick={(e) => {
                    e.target._clearCache();
                    alert("e click :>> ", e);
                  }}
                  onTap={(e) => {
                    console.log("e tap :>> ", e);
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
                  onClick={() => handleClick(slice.id)}
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
                    console.log("e hover :>> ", e);
                    container.style.cursor = "pointer";
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
          <Group>
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
              onClick={(e) => {
                console.log("e click :>> ", e);
              }}
              onTap={(e) => {
                console.log("e tap :>> ", e);
              }}
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
              height={height - 120}
              width={width}
              fill="white"
              align="center"
              verticalAlign="middle"
              fontSize={15}
              fontFamily="Rubik"
            />
          </Group>
          {/* </Group> */}
        </Layer>
      </Stage>
    </div>
  );
};

export default Ground;
