import type { MovementType } from "@/types";
import { Location_Depr, type SerializedLocation } from "./Location";

export type SerializedMovement = {
    type: MovementType,
    srcLocation: SerializedLocation,
    destLocation: SerializedLocation,
    isPossible: boolean,
    an: string
};

export class Movement_Depr {
    type: MovementType;
    srcLocation: Location_Depr;
    destLocation: Location_Depr;

    /**
     * A class representing a movement following AN.
     * 
     * @param type movement type. Use MovementTypesEnum
     * @param srcLocation the location from where the piece is being moved.
     * @param destLocation (optional) the location of the target square. Where the piece is being moved to.
     *                                  Can be null if movement type is rotation
     * 
     * @see MovementTypesEnum for movement type param
     */
    constructor(type: MovementType, srcLocation: Location_Depr, destLocation: Location_Depr) {
        this.type = type;
        this.srcLocation = srcLocation;
        this.destLocation = destLocation;
    }

    /**
     * Returns a new Movement object from the provided algebraic notation for movement.
     * @see AlgebraicNotation.md to learn more about the Algebraic Notation for this game
     * 
     * @param {string} algebraicNotation the algebraic notation text to transform into Movement
     */
    static parse(algebraicNotation: string) {
        if (algebraicNotation) {
            // First of all get the type of movement being performed.
            if (algebraicNotation.includes("u")) {
                // Special Move
                const [src, dest] = algebraicNotation.split("u");
                const srcLocation = Location_Depr.fromAN(src);
                const destLocation = Location_Depr.fromAN(dest);
                return new Movement_Depr('special', srcLocation, destLocation);

            } else if (algebraicNotation.includes("+")) {
                // Clockwise rotation
                const [src] = algebraicNotation.split("+");
                const srcLocation = Location_Depr.fromAN(src);
                return new Movement_Depr('clockwise_rotation', srcLocation, null);

            } else if (algebraicNotation.includes("-")) {
                // Clockwise rotation
                const [src] = algebraicNotation.split("-");
                const srcLocation = Location_Depr.fromAN(src);
                return new Movement_Depr('anticlockwise_rotation', srcLocation, null);

            } else {
                // Normal move
                const src = algebraicNotation.slice(0, 2);
                const dest = algebraicNotation.slice(2, 4);
                const srcLocation = Location_Depr.fromAN(src);
                const destLocation = Location_Depr.fromAN(dest);
                return new Movement_Depr('normal', srcLocation, destLocation);
            }
        } else {
            throw new Error(`Invalid algebraic notation: '${algebraicNotation}'`);
        }
    }

    /**
     * Check if the movement is possible, in other words, if it not of type #INVALID
     * @returns {boolean} true if possible, otherwise false
     */
    get isPossible(): boolean {
        return this.type !== 'invalid';
    }

    /**
     * Returns the algebraic notation string form of this movement object
     * 
     * @returns {string} The Algebraic notation of the movement
     */
    get an(): string {
        const srcAN = this.srcLocation.an;
        switch (this.type) {
            case 'normal':
                return `${srcAN}${this.destLocation.an}`; // e.g: j4j3

            case 'special':
                return `${srcAN}u${this.destLocation.an}`; // e.g: f4ug3

            case 'clockwise_rotation':
                return `${srcAN}+`; // e.g: h2+

            case 'anticlockwise_rotation':
                return `${srcAN}-`; // e.g: h2-
        }

        return null;
    }

    /**
     * Serializes the Movement object into an Object.
     * @returns plain object, representing this instance
     */
    serialize(): SerializedMovement {
        return {
            type: this.type,
            srcLocation: this.srcLocation instanceof Location_Depr ? this.srcLocation.serialize() : this.srcLocation,
            destLocation: this.destLocation instanceof Location_Depr ? this.destLocation.serialize() : this.destLocation,
            isPossible: this.isPossible,
            an: this.an
        };
    }
}