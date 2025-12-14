import type { Location } from "./location";
import type { Point } from "./point";

/**
 * @deprecated - no need, cuz can be inferred from the path this segment belongs to
 */
export type LaserPathSegmentType = 'start' | 'central' | 'end';

export type LaserEffectKill = 'kill';
export type LaserEffectDeflect = 'deflect';
export type LaserEffectNone = 'none';
export type LaserEffectBlock = 'block'; // remark: behaves the same as none, but this explicitly indicates that it was blocked by a defender piece
export type LaserEffect = LaserEffectKill | LaserEffectDeflect | LaserEffectBlock | LaserEffectNone

export type LaserDirection = 'top' | 'right' | 'bottom' | 'left';

export type LaserPathSegment = {
    /**
     * The effect to apply to the piece at this laser segment location.
     */
    effect: LaserEffect,

    /**
     * The direction this laser segment is facing.
     */
    direction: LaserDirection,

    /**
     * The location of the laser segment.
     */
    location: Location,
}

export type LaserPath = LaserPathSegment[];

/**
 * [x1, y1, x2, y2, ...]
 */
export type LaserPathPoints = Point[];

export type LaserPathFlattenedPoints = number[];