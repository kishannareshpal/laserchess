import type { LaserActionType, LaserDirection, LaserEvent } from "@/types";
import type { Location_Depr, SerializedLocation } from "./Location";

export type SerializedLaserPath = {
    eventType: LaserEvent;
    direction: LaserDirection;
    actionType: LaserActionType;
    location: SerializedLocation;
};

/**
 * A class representing the path of laser in the full route.
 */
export class LaserPath_Depr {
    eventType: LaserEvent;
    direction: LaserDirection;
    actionType: LaserActionType;
    location: Location_Depr;

    /**
     * Create a new instance of LaserPath
     * 
     * @param eventType the event of the laser happening on this location.
     * @param {LaserDirectionsEnum} direction the direction that the laser is poining in this location.
     * @param {LaserActionTypesEnum} actionType the action taken by the laser on this location.
     * @param {Location_Depr} location the location where the laser is reflecting at the moment.
     */
    constructor(eventType: LaserEvent, direction: LaserDirection, actionType: LaserActionType, location: Location_Depr) {
        this.eventType = eventType;
        this.direction = direction;
        this.actionType = actionType;
        this.location = location;
    }

    serialize(): SerializedLaserPath {
        return {
            eventType: this.eventType,
            direction: this.direction,
            actionType: this.actionType,
            location: this.location.serialize()
        };
    }
}