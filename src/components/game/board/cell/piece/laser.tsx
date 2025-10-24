import { Circle, Group, Rect } from "react-konva";
import type { PieceProps } from "./types";
import { CellUIHelper } from "@/models/helpers/cell-ui-helper";
import { useTheme } from "@/lib/hooks/use-theme";

type LaserProps = PieceProps;

export const Laser = ({
  id,
  position,
  length,
  piece,
  enabled,
  onSelect,
}: LaserProps) => {
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
      draggable={false}
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
    >
      <Circle
        x={length / 2}
        y={length / 2}
        fill={theme.colors.piece.primary[piece.playerType]}
        stroke={theme.colors.piece.stroke[piece.playerType]}
        strokeWidth={4}
        radius={length / 2 - pixelLength}
      />

      <Rect
        x={length / 2 - (pixelLength * 2) / 2}
        y={pixelLength / 2}
        width={pixelLength * 2}
        height={length / 2}
        fill={theme.colors.piece.secondary[piece.playerType]}
        stroke={theme.colors.piece.stroke[piece.playerType]}
        strokeWidth={4}
        cornerRadius={length}
      />

      <Circle
        x={length / 2}
        y={pixelLength}
        width={pixelLength / 2}
        fill={theme.colors.piece.mirror[piece.playerType]}
      />
    </Group>
  );
};
