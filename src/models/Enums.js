/**
 * Game
 * 
 * @deprecated
 */
export const PlayerTypesEnum = Object.freeze({
    RED: "red",
    BLUE: "blue"
});

/**
 * @deprecated
 */
export const CellTypesEnum = Object.freeze({
    NORMAL: "n",
    LASER: "l",
    RESERVED: "r"
});

/**
 * @deprecated
 */
export const SquareTypesEnum = Object.freeze({
    NORMAL: "normal",
    LASER_BLUE: "laser-blue",
    LASER_RED: "laser-red",
    RESERVED_BLUE: "reserved-blue",
    RESERVED_RED: "reserved-red"
});

/**
 * @deprecated
 */
export const GameStatusEnum = Object.freeze({
    PLAYING: "playing",
    PAUSED: "paused",
    GAME_OVER: "gameover"
});



/**
 * Piece
 */
// export const PieceColorsEnum = Object.freeze({
//     RED: "red",
//     BLUE: "blue"
// });

/**
 * @deprecated
 */
export const PieceTypesEnum = Object.freeze({
    KING: "k",
    DEFLECTOR: "b",
    DEFENDER: "d",
    SWITCH: "s",
    LASER: "l"
});


/**
 * Laser
 * 
 * @deprecated
 */
export const LaserEventsEnum = Object.freeze({
    START: "start",
    CENTRAL: "central",
    END: "end"
});

/**
 * @deprecated
 */
export const LaserDirectionsEnum = Object.freeze({
    TOP: "top",
    RIGHT: "right",
    BOTTOM: "bottom",
    LEFT: "left"
});

/**
 * @deprecated
 */
export const LaserActionTypesEnum = Object.freeze({
    DEFLECT: "deflect",
    KILL: "kill",
    NOTHING: "nothing"
});



/**
 * Movement
 * 
 * @deprecated
 */
export const RotationTypesEnum = Object.freeze({
    CLOCKWISE: "+", // indicates a clockwise rotation of a piece.
    COUNTER_CLOCKWISE: "-" // indicates a counter-clockwise rotation of a piece.
});

/**
 * @deprecated
 */
export const MovementTypesEnum = Object.freeze({
    INVALID: "invalid", // indicates an invalid move. This can be when the destLocation is not a valid square on the board
    NORMAL: "normal", // indicates the normal move. Simply from one location to another.
    SPECIAL: "special", // indicates the special move made by the Switch piece. Swap!
    ROTATION_CLOCKWISE: "clockwise_rotation", // indicates a clockwise rotation of a piece at src.
    ROTATION_C_CLOCKWISE: "c_clockwise_rotation" // indicates a counter-clockwise rotation of the piece at src.
});