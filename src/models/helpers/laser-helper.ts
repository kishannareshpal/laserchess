import type { PlayerType } from "@/types";
import LHAN_RELATIONS_JSON from "@/assets/laser-v-piece.json";
import type { LaserDirection, LaserEffect, LaserEffectDeflect, LaserEffectKill, LaserEffectNone, LaserPath, LaserPathFlattenedPoints, LaserPathPoints } from "@/models/laser";
import { CellHelper } from "./cell-helper";
import type { Cell, CellGrid } from "@/models/cell";
import type { Piece } from "@/models/piece";
import { LocationHelper } from "./location-helper";
import type { Location } from "@/models/location";
import { PositionHelper } from "./position-helper";
import { PointHelper } from "./point-helper";

type SegmentEffectResult =
    { effect: LaserEffectDeflect, nextDirection: LaserDirection }
    | { effect: LaserEffectKill | LaserEffectNone }

export class LaserHelper {
    static computeLaserPath(playerType: PlayerType, cellGrid: CellGrid): LaserPath {
        const laserCell = CellHelper.getPlayerLaserCell(playerType, cellGrid);
        if (!laserCell || !CellHelper.hasPiece(laserCell)) {
            return [];
        }

        let currentSegmentEffect: LaserEffect = 'none';
        let currentSegmentLaserDirection = this.getLaserBeamDirection(laserCell.piece)
        let currentSegmentLocation: Readonly<Location> = structuredClone(laserCell.location);

        if (!currentSegmentLaserDirection) {
            return [];
        }

        // Initiate from the laser beam cell
        const path: LaserPath = [
            {
                effect: currentSegmentEffect,
                direction: currentSegmentLaserDirection,
                location: currentSegmentLocation,
            }
        ];

        let isPathOpen: boolean = true;
        while (isPathOpen) {
            currentSegmentLocation = LocationHelper.findAdjacentLocation(
                currentSegmentLocation,
                currentSegmentLaserDirection
            );

            if (!currentSegmentLocation) {
                // Beam will leave the board - previous segment is considered the last
                currentSegmentEffect = 'none';
                currentSegmentLaserDirection = null;
                isPathOpen = false;
                break;
            } else {
                const cellUnderCurrentSegment = CellHelper.getCellAt(cellGrid, currentSegmentLocation);
                if (!CellHelper.hasPiece(cellUnderCurrentSegment)) {
                    // No piece at this cell, beam continues through the same direction
                    currentSegmentEffect = 'none';

                } else {
                    // Piece was found, figure out it's effect on the beam
                    const effectResult = this.determineSegmentEffectAt(cellUnderCurrentSegment, currentSegmentLaserDirection);
                    currentSegmentEffect = effectResult.effect;
                    currentSegmentLaserDirection = effectResult.effect === 'deflect' ? effectResult.nextDirection : currentSegmentLaserDirection;
                }

                isPathOpen = currentSegmentEffect !== 'kill';
            }

            // Register this segment
            path.push({
                effect: currentSegmentEffect,
                direction: currentSegmentLaserDirection,
                location: currentSegmentLocation
            })
        }

        return path;
    }

    static convertLaserPathToPoints(laserPath: LaserPath, cellLength: number): LaserPathPoints {
        const halfCell = cellLength / 2;

        return laserPath.map((segment, index) => {
            const isFirst = index === 0;
            const isLast = index === laserPath.length - 1;
            const isEdge = isFirst || isLast;

            // Use PositionHelper for endpoints
            if (isEdge) {
                return PositionHelper.fromLocation(segment.location, cellLength, { centered: true });
            }

            const { rowIndex, colIndex } = segment.location;
            const baseX = colIndex * cellLength;
            const baseY = rowIndex * cellLength;

            let x = baseX + halfCell;
            let y = baseY + halfCell;

            // Adjust position depending on direction and effect
            switch (segment.direction) {
                case 'top':
                    y = segment.effect === 'deflect' ? baseY + halfCell : baseY;
                    break;

                case 'bottom':
                    y = segment.effect === 'deflect' ? baseY + halfCell : baseY + cellLength;
                    break;

                case 'left':
                    x = segment.effect === 'deflect' ? baseX + halfCell : baseX;
                    break;

                case 'right':
                    x = segment.effect === 'deflect' ? baseX + halfCell : baseX + cellLength;
                    break;
            }

            return { x, y };
        });
    }

    static computeFlattenedLaserPathPoints(
        playerType: PlayerType,
        cellGrid: CellGrid,
        cellLength: number
    ): LaserPathFlattenedPoints {
        const laserPath = this.computeLaserPath(playerType, cellGrid);
        const points = this.convertLaserPathToPoints(laserPath, cellLength);

        return PointHelper.flatten(points);
    }

    /**
     * Returns the direction where the laser is currently pointing, based on it's orientation
     * 
     * @param piece the laser piece of which we want to get the direction from.
     * @returns the laser beam direction
     */
    static getLaserBeamDirection(piece: Piece): LaserDirection | null {
        // Invalid piece. Must be a laser piece.
        if (piece.type !== 'l') {
            return null;
        }

        const orientation = piece.orientation;
        switch (orientation) {
            case 0:
                return 'top';

            case 90:
                return 'right';

            case 180:
                return 'bottom';

            case 270:
                return 'left';
        }
    }

    static determineSegmentEffectAt(cell: Cell, segmentLaserDirection: LaserDirection): SegmentEffectResult {
        if (!CellHelper.hasPiece(cell)) {
            return { effect: 'none' }
        }

        const orientation = cell.piece.orientation;
        const type = cell.piece.type;
        const hitAction = LHAN_RELATIONS_JSON[segmentLaserDirection][type][orientation];

        if (hitAction === "kill") {
            return { effect: 'kill' };
        } else if (hitAction === "nothing") {
            return { effect: 'none' };
        } else {
            return {
                effect: 'deflect',
                nextDirection: hitAction as LaserDirection
            };
        }
    }
}