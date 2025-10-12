import type { Position } from "@/models/models/position";
import type { OrientationDegrees } from "@/types";
import { Circle, Group, Line, Shape } from "react-konva";

type KingProps = {
  position: Position;
  length: number;
  rotation?: OrientationDegrees;
};

export const King = ({ position, length, rotation }: KingProps) => {
  const offset = length / 2;
  const pixelLength = length / 8;

  return (
    <Group
      x={position.x + offset}
      y={position.y + offset}
      width={length}
      height={length}
      offsetX={offset}
      offsetY={offset}
      rotation={rotation}
    >
      <Line
        points={[
          pixelLength + pixelLength / 2,
          length - pixelLength,
          length - pixelLength - pixelLength / 2,
          length - pixelLength,
        ]}
        stroke="black"
        strokeWidth={4}
        lineCap="round"
        lineJoin="round"
      />

      <Shape
        fill="yellow"
        stroke="black"
        strokeWidth={4}
        lineJoin="round"
        lineCap="round"
        sceneFunc={(context, shape) => {
          context.beginPath();
          context.moveTo(
            pixelLength + pixelLength / 2,
            length - pixelLength * 2,
          );
          context.lineTo(pixelLength, pixelLength * 3);
          context.lineTo(
            pixelLength * 2 + pixelLength / 2,
            pixelLength * 3 + pixelLength / 2,
          );
          context.lineTo(length / 2, pixelLength);
          context.lineTo(
            length - pixelLength * 2 - pixelLength / 2,
            pixelLength * 3 + pixelLength / 2,
          );
          context.lineTo(length - pixelLength, pixelLength * 3);
          context.lineTo(
            length - pixelLength - pixelLength / 2,
            length - pixelLength * 2,
          );
          context.closePath();

          // (!) Konva specific method, it is very important
          context.fillStrokeShape(shape);
        }}
      />

      <Circle
        x={pixelLength}
        y={pixelLength * 3}
        fill="black"
        strokeEnabled={false}
        radius={pixelLength / 2}
      />

      <Circle
        x={length / 2}
        y={pixelLength}
        fill="black"
        strokeEnabled={false}
        radius={pixelLength / 2}
      />

      <Circle
        x={length - pixelLength}
        y={pixelLength * 3}
        fill="black"
        strokeEnabled={false}
        radius={pixelLength / 2}
      />
    </Group>
  );
};
