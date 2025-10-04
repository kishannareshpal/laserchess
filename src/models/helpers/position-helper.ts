import type { Location } from "../models/location";
import type { Position } from "../models/position";

export class PositionHelper {
    /**
     * Returnes a new {@link Position} with the same provided value ({@link component}) for both coordinates (x,y).
     * 
     * @param component - The value to apply for both coordinates.
     */
    static fromScalar(component: number): Position {
        return { x: component, y: component }
    }

    /**
     * Returns a new {@link Position} in the board for a given location.
     * 
     * @param location The location of the cell in the board.
     * @param cellLength The size of the cell in the board grid.
     * @param options Additional options (default: undefined)
     * @param options.centered (default: not set) when not set or false, the position will be 'the top left corner of the cell', otherwise it'll be the middle of the cell.
     * @param options.offset (default: not set) when not set, the provided offset x,y values will be applied to the resulting position.
     * @returns {number}
     */
    static fromLocation(
        location: Location,
        cellLength: number,
        options?: { centered?: boolean, offset?: Position }
    ): Position {
        let x = location.colIndex * cellLength;
        let y = location.rowIndex * cellLength;

        if (options?.centered) {
            x += (cellLength / 2);
            y += (cellLength / 2);
        }

        // Apply an optional offset
        if (options?.offset) {
            if (options.offset.x) {
                x += options.offset.x;
            }

            if (options.offset.y) {
                y += options.offset.y;
            }
        }

        return {
            x: x,
            y: y
        }
    }

    static equals(positionA: Position, positionB: Position): boolean {
        return (positionA.x === positionB.x) && (positionA.y === positionB.y)
    }
}