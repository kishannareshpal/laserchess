import { Shape } from "react-konva";
import type { CellBackgroundProps } from "./types";
import { useTheme } from "@/lib/hooks/use-theme";

export const ReservedPlayerOne = ({ position, length }: CellBackgroundProps) => {
    const theme = useTheme();

    const pixelLength = length / 8;

    return (
        <Shape
            x={position.x}
            y={position.y}
            width={length}
            height={length}
            stroke={theme.colors.cell.reserved.stroke["player-one"]}
            strokeWidth={1}
            sceneFunc={(context, shape) => {
                context.beginPath();

                for (let i = 0; i < 8; i++) {
                    context.moveTo(0, pixelLength * i);
                    context.lineTo(pixelLength * i, 0);
                }

                for (let i = 0; i < 8; i++) {
                    context.moveTo(pixelLength * i, length);
                    context.lineTo(length, pixelLength * i);
                }

                // (!) Konva specific method, it is very important
                context.fillStrokeShape(shape);
            }}
        />
    );
}