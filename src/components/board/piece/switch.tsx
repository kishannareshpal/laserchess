import type { Position } from "@/models/models/position";
import { Group, Shape } from "react-konva";

type SwitchProps = {
  position: Position;
  length: number;
};

export const Switch = ({ position, length }: SwitchProps) => {
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
      rotation={0}
    >
      <Shape
        fill="yellow"
        stroke="black"
        strokeWidth={4}
        lineJoin="round"
        lineCap="round"
        sceneFunc={(context, shape) => {
          context.beginPath();
          context.moveTo(pixelLength * 2, pixelLength);
          context.lineTo(pixelLength * 3, pixelLength);
          context.lineTo(length - pixelLength, length - pixelLength * 3);
          context.lineTo(length - pixelLength, length - pixelLength * 2);
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
          context.moveTo(pixelLength, pixelLength * 2);
          context.lineTo(pixelLength, pixelLength * 3);
          context.lineTo(length - pixelLength * 3, length - pixelLength);
          context.lineTo(length - pixelLength * 2, length - pixelLength);
          context.closePath();

          // (!) Konva specific method, it is very important
          context.fillStrokeShape(shape);
        }}
      />

      <Shape
        fill="red"
        stroke="black"
        strokeWidth={4}
        lineJoin="round"
        lineCap="round"
        sceneFunc={(context, shape) => {
          context.beginPath();
          context.moveTo(pixelLength * 2, pixelLength);
          context.lineTo(length - pixelLength, length - pixelLength * 2);
          context.lineTo(length - pixelLength * 2, length - pixelLength);
          context.lineTo(pixelLength, pixelLength * 2);
          context.closePath();

          // (!) Konva specific method, it is very important
          context.fillStrokeShape(shape);
        }}
      />
    </Group>
  );
};
