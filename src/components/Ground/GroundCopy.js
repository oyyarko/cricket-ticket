import React, { useRef } from "react";
import Konva from "konva";
import { Stage, Layer, Rect, Text, Arc, Circle, Group } from "react-konva";
import {
  ARC_ANGLE,
  ARC_INNER_RADIUS,
  ARC_OUTER_RADIUS,
} from "../../config/ground";

const slices = [
  [
    { angle: 0, color: "red" },
    { angle: 45, color: "violet" },
    { angle: 90, color: "blue" },
    { angle: 135, color: "yellow" },
    { angle: 180, color: "purple" },
    { angle: 225, color: "orange" },
    { angle: 270, color: "cyan" },
    { angle: 315, color: "magenta" },
  ],
  [
    { angle: 0, color: "red" },
    { angle: 45, color: "violet" },
    { angle: 90, color: "blue" },
    { angle: 135, color: "yellow" },
    { angle: 180, color: "purple" },
    { angle: 225, color: "orange" },
    { angle: 270, color: "cyan" },
    { angle: 315, color: "magenta" },
  ],
];

const Ground = () => {
  const stageRef = useRef();
  const width = window.innerWidth;
  const height = window.innerHeight;

  //   const drawArc = (
  //     pos,
  //     posOffset,
  //     offset,
  //     color,
  //     deg,
  //     innerRadius,
  //     innerHeight,
  //     angle
  //   ) => {
  //     return (
  //       <>
  //         <Arc
  //           x={pos.x - posOffset.x}
  //           y={pos.y + posOffset.y}
  //           innerRadius={innerRadius}
  //           innerHeight={innerHeight}
  //           angle={angle}
  //           fill={color}
  //           stroke={"black"}
  //           offsetX={offset.x}
  //           offsetY={offset.y}
  //           rotationDeg={deg}
  //         />
  //       </>
  //     );
  //   };

  return (
    <Stage width={width} height={height} ref={stageRef}>
      <Layer>
        <Group>
          {slices.map((slice, index) => (
            <>
              {slice.map((sl, id) => (
                <>
                  <Arc
                    key={id}
                    x={width / 2}
                    y={height / 2}
                    innerRadius={50}
                    outerRadius={140}
                    angle={45}
                    rotation={sl.angle}
                    fill={sl.color}
                    stroke="black"
                    strokeWidth={2}
                  />
                </>
              ))}
              {console.log("slice :>> ", slice, slices)}
            </>
          ))}
          <Circle x={width / 2} y={height / 2} radius={50} fill="green" />
        </Group>
      </Layer>
    </Stage>
    // <Stage ref={stageRef} width={width} height={height}>
    //   <Layer>
    //     <Circle
    //       x={width / 2}
    //       y={height / 2}
    //       radius={250}
    //       fill={"green"}
    //       stroke={"black"}
    //       rotationDeg={0}
    //     />
    //     {drawArc(
    //       { x: width / 2, y: height / 2 },
    //       { x: -250, y: 0 },
    //       { x: 0, y: 0 },
    //       "yellow",
    //       -40,
    //       220,
    //       120,
    //       90
    //     )}
    //     {drawArc(
    //       { x: width / 2, y: height / 2 },
    //       { x: -250, y: 0 },
    //       { x: 0, y: 0 },
    //       "cyan",
    //       -120,
    //       220,
    //       120,
    //       0
    //     )}
    //   </Layer>
    // </Stage>
  );
};

export default Ground;
