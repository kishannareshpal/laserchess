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


/**
 * Hex color representing the cell background
 * @constant
 */
export const CELL_BACKGROUND_COLOR: string = "#ffffff"; // a sort of dark grey #313134 FFD9C6 E2C8B6

/**
 * Hex color representing the cell's stroke
 * @constant
 */
export const CELL_STROKE_COLOR: string = "black"; // a sort of dark grey #313134

export const CELL_STROKE_WIDTH: number = 2;
export const CELL_HIGHLIGHT_STROKE_WIDTH: number = CELL_STROKE_WIDTH * 2;

export const BOARD_STROKE_WIDTH: number = CELL_STROKE_WIDTH * 2;
