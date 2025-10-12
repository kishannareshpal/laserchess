import type { Position } from "@/models/models/position";
import { Circle, Group, Rect } from "react-konva";

type LaserProps = {
  position: Position;
  length: number;
};

export const Laser = ({ position, length }: LaserProps) => {
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
      <Circle
        x={length / 2}
        y={length / 2}
        fill="red"
        stroke="black"
        strokeWidth={4}
        radius={length / 2 - pixelLength}
      />

      <Rect
        x={length / 2 - (pixelLength * 2) / 2}
        y={pixelLength / 2}
        width={pixelLength * 2}
        height={length / 2}
        fill="yellow"
        stroke="black"
        strokeWidth={4}
        cornerRadius={length}
      />

      <Circle
        x={length / 2}
        y={pixelLength}
        width={pixelLength / 2}
        fill="green"
      />
    </Group>
  );
};
