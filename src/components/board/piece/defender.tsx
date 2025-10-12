import type { Position } from "@/models/models/position";
import { Group, Rect, Shape } from "react-konva";

type DefenderProps = {
  position: Position;
  length: number;
};

export const Defender = ({ position, length }: DefenderProps) => {
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
      // rotation={270}
    >
      <Rect
        x={pixelLength}
        y={pixelLength * 2}
        fill="red"
        stroke="black"
        strokeWidth={4}
        lineCap="round"
        lineJoin="round"
        width={length - pixelLength * 2}
        height={length - pixelLength * 3}
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
          context.lineTo(pixelLength * 2, pixelLength);
          context.lineTo(length - pixelLength * 2, pixelLength);
          context.lineTo(length - pixelLength, pixelLength * 2);
          context.closePath();

          // (!) Konva specific method, it is very important
          context.fillStrokeShape(shape);
        }}
      />
    </Group>
  );
};
