import { Circle, Group, Rect } from "react-konva";
import type { PieceProps } from "./types";
import { CellUIHelper } from "@/models/helpers/cell-ui-helper";
import { PieceUIHelper } from "@/models/helpers/piece-ui-helper";

type LaserProps = PieceProps;

export const Laser = ({
  id,
  position,
  length,
  piece,
  enabled,
  onSelect,
  onDragStart,
  onDragEnd,
}: LaserProps) => {
  const offset = length / 2;
  const pixelLength = length / 8;

  return (
    <Group
      id={id}
      x={position.x + offset}
      y={position.y + offset}
      width={length}
      height={length}
      offsetX={offset}
      offsetY={offset}
      rotation={piece.orientation}
      listening={enabled}
      draggable
      onMouseDown={(e) => {
        CellUIHelper.setCursorStyle(e.target, "grabbing");
      }}
      onMouseUp={(e) => {
        CellUIHelper.setCursorStyle(e.target, "grab");
      }}
      onMouseOver={(e) => {
        CellUIHelper.setCursorStyle(e.target, "grab");
      }}
      onMouseOut={(e) => {
        CellUIHelper.setCursorStyle(e.target, "default");
      }}
      onTap={onSelect}
      onClick={onSelect}
      dragBoundFunc={(position) =>
        PieceUIHelper.clampPositionToBoardBounds(position, length)
      }
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <Circle
        x={length / 2}
        y={length / 2}
        fill="white"
        stroke="black"
        strokeWidth={4}
        radius={length / 2 - pixelLength}
      />

      <Rect
        x={length / 2 - (pixelLength * 2) / 2}
        y={pixelLength / 2}
        width={pixelLength * 2}
        height={length / 2}
        fill="lightgrey"
        stroke="black"
        strokeWidth={4}
        cornerRadius={length}
      />

      <Circle
        x={length / 2}
        y={pixelLength}
        width={pixelLength / 2}
        fill="black"
      />
    </Group>
  );
};
