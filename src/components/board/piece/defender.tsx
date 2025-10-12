import { Group, Rect, Shape } from "react-konva";
import type { PieceProps } from "./types";
import { CellUIHelper } from "@/models/helpers/cell-ui-helper";
import { PieceUIHelper } from "@/models/helpers/piece-ui-helper";

type DefenderProps = PieceProps;

export const Defender = ({
  id,
  position,
  length,
  piece,
  enabled,
  onSelect,
  onDragStart,
  onDragEnd,
}: DefenderProps) => {
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
