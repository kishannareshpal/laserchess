/**
 * Game
 */
export const PlayerTypesEnum = Object.freeze({
    RED: "red",
    BLUE: "blue"
});

export const CellTypesEnum = Object.freeze({
    NORMAL: "n",
    LASER: "l",
    RESERVED: "r"
});

export const GameStatusEnum = Object.freeze({
    PLAYING: "playing",
    PAUSED: "paused",
    FINISHED: "finished"
});



/**
 * Piece
 */
// export const PieceColorsEnum = Object.freeze({
//     RED: "red",
//     BLUE: "blue"
// });

export const PieceTypesEnum = Object.freeze({
    KING: "k",
    DEFLECTOR: "b",
    DEFENDER: "d",
    SWITCH: "s",
    LASER: "l"
});


/**
 * General
 */
export const LaserBeamDirectionsEnum = Object.freeze({
    TOP: "top",
    RIGHT: "right",
    BOTTOM: "bottom",
    LEFT: "left"
});

export const LaserHitActionTypesEnum = Object.freeze({
    DEFLECT: "deflect",
    KILL: "kill",
    NOTHING: "nothing"
});



/**
 * Movement
 */
export const RotationTypesEnum = Object.freeze({
    CLOCKWISE: "+", // indicates a clockwise rotation of a piece.
    COUNTER_CLOCKWISE: "-" // indicates a counter-clockwise rotation of a piece.
});

export const MovementTypesEnum = Object.freeze({
    INVALID: "invalid", // indicates an invalid move. This can be when the destLocation is not a valid square on the board
    NORMAL: "normal", // indicates the normal move. Simply from one location to another.
    SPECIAL: "special", // indicates the special move made by the Switch piece. Swap!
    ROTATION_CLOCKWISE: "clockwise_rotation", // indicates a clockwise rotation of a piece at src.
    ROTATION_C_CLOCKWISE: "c_clockwise_rotation" // indicates a counter-clockwise rotation of the piece at src.
});