import type Konva from "konva";
import type { RefObject } from "react";

export type PlayerType = 'player-one' | 'player-two';

export type CellType = 'normal' | 'reserved-player-one' | 'reserved-player-two' | 'laser-player-two' | 'laser-player-one';

/**
 * @deprecated
 */
export type SquareType = CellType;

export type GameStatus = 'idle' | 'playing' | 'paused' | 'over';

/**
 * @deprecated
 */
export type LaserActionType = 'kill' | 'deflect' | 'nothing';

/**
 * @deprecated
 */
export type LaserDirection = 'top' | 'right' | 'bottom' | 'left';

/**
 * @deprecated
 */
export type LaserEvent = 'start' | 'central' | 'end';


export type KingPieceType = 'k';
export type DefenderPieceType = 'd';
export type DeflectorPieceType = 'b';
export type SwitchPieceType = 's';
export type LaserPieceType = 'l';
export type PieceType = KingPieceType | DefenderPieceType | DeflectorPieceType | SwitchPieceType | LaserPieceType;

export type PieceName = 'king' | 'defender' | 'deflector' | 'switch' | 'laser';

export type ClockwiseRotationType = '+'; // 90 degrees clockwise
export type AnticlockwiseRotationType = '-';
export type RotationType = ClockwiseRotationType | AnticlockwiseRotationType;

export type OrientationDegrees = 0 | 90 | 180 | 270; // in degrees

export type MovementType = 'invalid' | 'normal' | 'special' | 'clockwise_rotation' | 'anticlockwise_rotation';

export type GridLayerRef = RefObject<Konva.Layer>;