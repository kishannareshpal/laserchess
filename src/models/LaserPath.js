/**
 * A class representing the path of laser in the full route.
 */
class LaserPath {
    /**
     * Create a new instance of LaserPath
     * 
     * @param {LaserEventsEnum} eventType the event of the laser happening on this location.
     * @param {LaserDirectionsEnum} direction the direction that the laser is poining in this location.
     * @param {LaserActionTypesEnum} actionType the action taken by the laser on this location.
     * @param {Location} location the location where the laser is reflecting at the moment.
     */
    constructor(eventType, direction, actionType, location) {
        this.eventType = eventType;
        this.direction = direction;
        this.actionType = actionType;
        this.location = location;
    }

    serialize() {
        return {
            eventType: this.eventType,
            direction: this.direction,
            actionType: this.actionType,
            location: this.location
        };
    }

}

export default LaserPath;