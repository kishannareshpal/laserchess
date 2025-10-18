import { Shape } from "react-konva";
import type { CellBackgroundProps } from "./types";

export const ReservedPlayerTwo = ({ position, length }: CellBackgroundProps) => {
    const pixelLength = length / 8;

    return (
        <Shape
            x={position.x}
            y={position.y}
            width={length}
            height={length}
            stroke="black"
            strokeWidth={1}
            sceneFunc={(context, shape) => {
                context.beginPath();

                for (let i = 0; i < 8; i += 3) {
                    context.moveTo(0, pixelLength * i);
                    context.lineTo(length - pixelLength * i, length);
                }

                for (let i = 3; i < 8; i += 3) {
                    context.moveTo(pixelLength * i, 0);
                    context.lineTo(length, length - pixelLength * i);
                }

                // (!) Konva specific method, it is very important
                context.fillStrokeShape(shape);
            }}
        />
    );
}