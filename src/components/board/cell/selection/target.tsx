import { Circle, Group, Rect } from "react-konva";
import useImage from 'use-image';
import type { Movement } from "@/models/models/movement";
import { PositionHelper } from "@/models/helpers/position-helper";
import { MovementHelper } from "@/models/helpers/movement-helper";
import targetReplaceIconSvg from '@/assets/target-replace-icon.svg'
import Konva from "konva";
import { useEffect, useRef } from "react";

type TargetProps = {
    movement: Movement,
    cellLength: number,
    onPress: (movement: Movement) => void,
}

export const Target = (
    {
        cellLength,
        movement,
        onPress
    }: TargetProps
) => {
    const [targetReplaceIconImage] = useImage(targetReplaceIconSvg);
    const targetReplaceIconImageRef = useRef<Konva.Image>(null);

    const targetReplaceIconSize = cellLength / 2;
    const position = PositionHelper.fromLocation(movement.targetCellLocation, cellLength)

    useEffect(() => {
        if (targetReplaceIconImage && targetReplaceIconImageRef.current) {
            targetReplaceIconImageRef.current.cache()
        }
    }, [targetReplaceIconImage]);

    const handlePress = () => {
        onPress(movement)
    }

    return (
        <Group
            id={`pt-${MovementHelper.toAN(movement)}`}
            onClick={handlePress}
            onTap={handlePress}
            onMouseOver={(e) => {
                e.target.getStage().container().style.cursor = "pointer";
            }}
            onMouseOut={(e) => {
                e.target.getStage().container().style.cursor = "default";
            }}
        >
            <Rect
                x={position.x}
                y={position.y}
                width={cellLength}
                height={cellLength}
                draggable={false}
                fill="white"
                opacity={0.5}
                lineCap="round"
                lineJoin="round"
            />

            <Circle
                x={position.x + cellLength / 2}
                y={position.y + cellLength / 2}
                fill="black"
                opacity={0.75}
                strokeWidth={0}
                strokeEnabled={false}
                radius={targetReplaceIconSize / 2}
            />
        </Group>
    )
}