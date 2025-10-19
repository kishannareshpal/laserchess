import type { Position } from "../models/position";

export class PointHelper {
    static flatten(points: Position[]): number[] {
        return points.flatMap((point) => [point.x, point.y]);
    }
}