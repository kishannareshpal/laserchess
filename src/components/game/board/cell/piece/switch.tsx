import { Group, Shape } from "react-konva";

import { CellUIHelper } from "@/models/helpers/cell-ui-helper";
import { PIECE_STROKE_WIDTH } from "@/constants";
import type { PieceProps } from "./types";
import { PieceUIHelper } from "@/models/helpers/piece-ui-helper";
import { useTheme } from "@/lib/hooks/use-theme";

type SwitchProps = PieceProps;

export const Switch = ({
  id,
  position,
  length,
  piece,
  enabled,
  onSelect,
  onDragStart,
  onDragEnd,
}: SwitchProps) => {
  const theme = useTheme();

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
      <Shape
        fill={theme.colors.piece.mirror[piece.playerType]}
        stroke={theme.colors.piece.stroke[piece.playerType]}
        strokeWidth={PIECE_STROKE_WIDTH}
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
        fill={theme.colors.piece.mirror[piece.playerType]}
        stroke={theme.colors.piece.stroke[piece.playerType]}
        strokeWidth={PIECE_STROKE_WIDTH}
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
        fill={theme.colors.piece.primary[piece.playerType]}
        stroke={theme.colors.piece.stroke[piece.playerType]}
        strokeWidth={PIECE_STROKE_WIDTH}
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
