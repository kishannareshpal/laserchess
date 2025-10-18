import type { Piece } from "@/models/models/piece";
import type { Position } from "@/models/models/position";
import type Konva from "konva";

export type PieceProps = {
  id: string;
  position: Position;
  length: number;
  piece: Piece;
  enabled: boolean;
  onDragStart: (event: Konva.KonvaEventObject<Event>) => void;
  onDragEnd: (event: Konva.KonvaEventObject<Event>) => void;
  onSelect: () => void;
};
