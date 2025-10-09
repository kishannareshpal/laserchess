import Konva from "konva";

export const COLUMN_COUNT = 10 as const;
export const ROW_COUNT = 8 as const;

/**
 * The duration of the animation of a piece movement.
 */
export const PIECE_MOVEMENT_ANIMATION_DURATION = 0.332 as const;

/**
 * @constant
 * The easing of the tween for any piece movement
 */
export const PIECE_MOVEMENT_ANIMATION_EASING_FN = Konva.Easings.BackEaseOut;
