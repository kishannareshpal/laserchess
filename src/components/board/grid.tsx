import { Group, Shape } from "react-konva";
import { CELL_STROKE_WIDTH, COLUMN_COUNT, ROW_COUNT } from "@/constants";
import type { Size } from "@/models/models/size";
import type { CellGrid } from "@/models/models/cell";
import { PositionHelper } from "@/models/helpers/position-helper";
import { Background } from "./cell/background";


type GridProps = {
    cellGrid: CellGrid,
    canvasSize: Size,
    cellLength: number
}

export const Grid = ({
    cellGrid,
    canvasSize,
    cellLength,
}: GridProps) => {


    const renderCellBackgrounds = () => {
        return cellGrid.flatMap((row) => {
            return row.map((cell) => {
                return (
                    <Background.Factory 
                        key={`cbg-${cell.id}`}
                        cellType={cell.type}
                        length={cellLength}
                        position={PositionHelper.fromLocation(cell.location, cellLength)}
                    />
                )
            });
        })
    }

    return (
        <Group>
            {renderCellBackgrounds()}

            <Shape
                width={canvasSize.width}
                height={canvasSize.height}
                strokeWidth={CELL_STROKE_WIDTH}
                stroke="black"
                sceneFunc={(context, shape) => {
                    context.beginPath();

                    // Draw vertical lines
                    for (let col = 0; col <= COLUMN_COUNT; col += 1) {
                        // Don't draw edge lines, as they are drawn via CSS border instead (this is the outer board stroke)
                        const isEdge = col === 0 || col === COLUMN_COUNT;
                        if (isEdge) {
                            continue;
                        }

                        const x = col * cellLength;
                        context.moveTo(x, 0);
                        context.lineTo(x, canvasSize.height);
                    }

                    // Draw horizontal lines
                    for (let row = 0; row <= ROW_COUNT; row += 1) {
                        // Don't draw edge lines, as they are drawn via CSS border instead (this is the outer board stroke)
                        const isEdge = row === 0 || row === ROW_COUNT;
                        if (isEdge) {
                            continue;
                        }

                        const y = row * cellLength;
                        context.moveTo(0, y);
                        context.lineTo(canvasSize.width, y);
                    }

                    context.closePath();
                    context.fillStrokeShape(shape);
                }}
            />            
        </Group>
    );
}