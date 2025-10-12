import type { Position } from "../models/position";

export class PieceUIHelper {
  static clampPositionToBoardBounds = (
    position: Position,
    cellLength: number,
  ): Position => {
    // Limit drag to inside the canvas.
    const firstCell = cellLength - cellLength / 2;
    const lastColHor = cellLength * 9 + cellLength / 2;
    const lastColVer = cellLength * 7 + cellLength / 2;

    // Clamp the x-coordinate
    const clampedX =
      position.x > lastColHor
        ? lastColHor
        : position.x < firstCell
          ? firstCell
          : position.x;

    // Clamp the y-coordinate
    const clampedY =
      position.y > lastColVer
        ? lastColVer
        : position.y < firstCell
          ? firstCell
          : position.y;

    return {
      x: clampedX,
      y: clampedY,
    };
  };
}
