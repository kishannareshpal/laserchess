import { LaserHelper } from "@/models/helpers/laser-helper";
import { PositionHelper } from "@/models/helpers/position-helper";
import type { LaserPathFlattenedPoints, LaserPathPoints, LaserPathSegment } from "@/models/laser";
import type { Position } from "@/models/position";
import { game$ } from "@/lib/store/game$";
import Konva from "konva";
import { useEffect, useRef, useState } from "react";
import { Circle, Group, Line, Rect } from "react-konva";
import type { GridLayerRef } from "@/types";
import { PointHelper } from "@/models/helpers/point-helper";
import { CellHelper } from "@/models/helpers/cell-helper";

/**
 * The duration of the animation of a piece movement.
 */
const KILL_ANIMATION_DURATION = 0.332 as const;

/**
 * @constant
 * The easing of the tween for any piece movement
 */
const KILL_ANIMATION_EASING_FN = Konva.Easings.BackEaseOut;

type LaserProps = {
    cellLength: number,
    gridLayerRef: GridLayerRef
}

export const Laser = (
    {
        cellLength,
        gridLayerRef
    }: LaserProps
) => {
    const [laserPathInfo, setLaserPathInfo] = useState<{
        pathPoints: LaserPathPoints,
        flattenedPathPoints: LaserPathFlattenedPoints,
        lastSegment: LaserPathSegment | null
    }>({
        pathPoints: [],
        flattenedPathPoints: [],
        lastSegment: null
    });

    const laserLineRef = useRef<Konva.Line>(null!);
    const laserHeadRef = useRef<Konva.Circle>(null!);
    const altLaserLineRef = useRef<Konva.Line>(null!);
    const trailLaserLineRef = useRef<Konva.Line>(null!);

    useEffect(() => {

        game$.turn.phase.onChange(({ value: phase }) => {
            if (phase === 'firing') {
                const laserPath = game$.turn.laserPath.peek();
                const lastLaserSegment = laserPath[laserPath.length - 1];
                const laserPathPoints = LaserHelper.convertLaserPathToPoints(laserPath, cellLength);
                const laserPathFlattenedPoints = PointHelper.flatten(laserPathPoints);

                setLaserPathInfo({
                    pathPoints: laserPathPoints,
                    flattenedPathPoints: laserPathFlattenedPoints,
                    lastSegment: lastLaserSegment
                });

                if (lastLaserSegment?.effect === 'kill') {
                    const cellAtFinalLocation = CellHelper.getCellAt(game$.cellGrid.peek(), lastLaserSegment.location);
                    const pieceElementFinalLocation = gridLayerRef.current.findOne(`#cp-${cellAtFinalLocation.id}`);

                    setTimeout(() => {
                        pieceElementFinalLocation?.to({
                            scaleY: 0,
                            scaleX: 0,
                            duration: KILL_ANIMATION_DURATION,
                            easing: KILL_ANIMATION_EASING_FN
                        });
                    }, 1000);
                }

                // Complete the current player's turn
                setTimeout(() => {
                    game$.finishTurn();
                }, 1500)
            } else {
                setLaserPathInfo({
                    pathPoints: [],
                    flattenedPathPoints: [],
                    lastSegment: null
                })
            }
        })
    }, [cellLength, gridLayerRef])

    useEffect(() => {
        if (!laserLineRef.current) {
            return;
        }

        // spring physics constants
        const stiffness = 0.025; // how fast it moves (like spring constant)
        const damping = 3.2; // how quickly it settles
        const points = laserPathInfo.pathPoints;

        // Simulated spring easing (damped harmonic motion)
        // value oscillates like a spring and gradually settles to 1
        const springEase = (time: number) => {
            return 1 - Math.exp(-damping * time) * Math.cos(stiffness * time * 20);
        };

        const laserLineAnimation = new Konva.Animation((frame) => {
            const time = frame.time; // milliseconds since animation started

            // total path length
            let totalLength = 0;
            for (let i = 1; i < points.length; i++) {
                const dx = points[i].x - points[i - 1].x;
                const dy = points[i].y - points[i - 1].y;
                totalLength += Math.sqrt(dx * dx + dy * dy);
            }

            // Map time to progress (0–1) using spring easing
            const durationInMs = 5000; // ms total animation duration
            const rawProgress = Math.min(time / durationInMs, 1);
            const springProgress = springEase(rawProgress * 10); // amplify spring motion

            const distanceToDraw = totalLength * springProgress;

            const drawingPoints = [points[0]];
            let totalDrawnDistance = 0;
            for (let currentPointIndex = 1; currentPointIndex < points.length; currentPointIndex++) {
                const previousPoint = points[currentPointIndex - 1];
                const currentPoint = points[currentPointIndex];
                const dx = currentPoint.x - previousPoint.x;
                const dy = currentPoint.y - previousPoint.y;
                const segmentLength = Math.sqrt(dx * dx + dy * dy);

                const totalDrawnDistanceAfterThis = totalDrawnDistance + segmentLength;
                if (totalDrawnDistanceAfterThis > distanceToDraw) {
                    const remaining = distanceToDraw - totalDrawnDistance;
                    const ratio = remaining / segmentLength;
                    drawingPoints.push({
                        x: previousPoint.x + dx * ratio,
                        y: previousPoint.y + dy * ratio,
                    });
                    break;
                } else {
                    drawingPoints.push(currentPoint);
                    totalDrawnDistance = totalDrawnDistanceAfterThis;
                }
            }

            laserLineRef.current.points(PointHelper.flatten(drawingPoints));
            altLaserLineRef.current.points(PointHelper.flatten(drawingPoints));

            // Trail
            // Total trail distance in pixels
            const trailDistance = cellLength;

            // Walk backward from the end to collect points until reaching the trail length
            let remainingTrailDistance = trailDistance;
            const trailPoints = [drawingPoints[drawingPoints.length - 1]];
            for (let i = drawingPoints.length - 1; i > 0 && remainingTrailDistance > 0; i--) {
                const p1 = drawingPoints[i];
                const p0 = drawingPoints[i - 1];
                const dx = p1.x - p0.x;
                const dy = p1.y - p0.y;
                const segLen = Math.sqrt(dx * dx + dy * dy);

                if (segLen >= remainingTrailDistance) {
                    // interpolate the last partial point
                    const ratio = remainingTrailDistance / segLen;
                    trailPoints.unshift({
                        x: p1.x - dx * ratio,
                        y: p1.y - dy * ratio,
                    });
                    break;
                } else {
                    trailPoints.unshift(p0);
                    remainingTrailDistance -= segLen;
                }
            }

            trailLaserLineRef.current.points(PointHelper.flatten(trailPoints));

            // Head point
            const headPoint = drawingPoints[drawingPoints.length - 1];
            laserHeadRef.current.position(headPoint)

            // Stop the animation when finished
            if (rawProgress >= 1) {
                laserLineAnimation.stop();
            }
        }, laserLineRef.current.getLayer());

        laserLineAnimation.start();

        return () => {
            laserLineAnimation.stop();
        };
    }, [cellLength, laserPathInfo]);

    if (!laserPathInfo.flattenedPathPoints.length) {
        return null;
    }

    const lastPathSegmentPosition: Position | null = laserPathInfo.lastSegment
        ? PositionHelper.fromLocation(laserPathInfo.lastSegment.location, cellLength)
        : null;

    return (
        <Group id="laser-path">
            <Line
                ref={laserLineRef}
                closed={false}
                stroke="#ff0000"
                strokeWidth={8}
                shadowEnabled={true}
                shadowColor="#ff0000"
                shadowBlur={12}
                shadowOffsetY={0}
                shadowOffsetX={0}
                lineCap="round"
                lineJoin="round"
                listening={false}
            />

            <Line
                ref={altLaserLineRef}
                stroke="white"
                lineJoin="round"
                lineCap="round"
                listening={false}
                strokeWidth={2}
            />

            <Circle
                ref={laserHeadRef}
                radius={6}
                fill="red"
                shadowColor="red"
                shadowBlur={20}
                shadowOpacity={0.9}
            />

            <Line
                ref={trailLaserLineRef}
                stroke="red"
                lineJoin="round"
                lineCap="round"
                opacity={0.8}
                listening={false}
                strokeWidth={2}
            />

            {(laserPathInfo.lastSegment.effect === 'kill') && lastPathSegmentPosition ? (
                <Rect
                    x={lastPathSegmentPosition.x}
                    y={lastPathSegmentPosition.y}
                    width={cellLength}
                    height={cellLength}
                    fill="#F7173588" // transparent-red
                />
            ) : null}
        </Group>
    );
}