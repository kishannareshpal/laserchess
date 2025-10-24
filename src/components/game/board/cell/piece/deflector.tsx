import { Group, Shape } from "react-konva";
import type { PieceProps } from "./types";
import { CellUIHelper } from "@/models/helpers/cell-ui-helper";
import { PieceUIHelper } from "@/models/helpers/piece-ui-helper";
import { useTheme } from "@/lib/hooks/use-theme";

type DeflectorProps = PieceProps;

export const Deflector = ({
  id,
  position,
  length,
  piece,
  enabled,
  onSelect,
  onDragStart,
  onDragEnd,
}: DeflectorProps) => {
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
        fill={theme.colors.piece.primary[piece.playerType]}
        stroke={theme.colors.piece.stroke[piece.playerType]}
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
        fill={theme.colors.piece.mirror[piece.playerType]}
        stroke={theme.colors.piece.stroke[piece.playerType]}
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
