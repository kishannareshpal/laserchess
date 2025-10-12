import type { Position } from "@/models/models/position";
import { Group, Shape } from "react-konva";

type DeflectorProps = {
  position: Position;
  length: number;
};

export const Deflector = ({ position, length }: DeflectorProps) => {
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
      rotation={180}
    >
      <Shape
        fill="red"
        stroke="black"
        strokeWidth={4}
        lineJoin="round"
        lineCap="round"
        sceneFunc={(context, shape) => {
          context.beginPath();
          context.moveTo(pixelLength, pixelLength);
          context.lineTo(length - pixelLength, pixelLength);
          context.lineTo(length - pixelLength, length - pixelLength);
          context.lineTo(pixelLength, pixelLength);
          context.closePath();

          // (!) Konva specific method, it is very important
          context.fillStrokeShape(shape);
        }}
      />

      <Shape
        fill="yellow"
        stroke="black"
        strokeWidth={4}
        lineJoin="round"
        lineCap="round"
        sceneFunc={(context, shape) => {
          context.beginPath();
          context.moveTo(pixelLength, pixelLength);
          context.lineTo(pixelLength, pixelLength * 2);
          context.lineTo(length - pixelLength * 2, length - pixelLength);
          context.lineTo(length - pixelLength, length - pixelLength);
          context.closePath();

          context.fillStrokeShape(shape);
        }}
      />
    </Group>
  );
};
