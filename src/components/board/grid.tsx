import type { CellType } from "@/types";
import { Rect } from "react-konva";
import { PositionHelper } from "@/models/helpers/position-helper";
import { useImage } from "react-konva-utils";
import blueLaserCellSvg from '@/assets/blue-laser-cell.svg';
import redLaserCellSvg from '@/assets/red-laser-cell.svg';
import blueReservedCellSvg from '@/assets/blue-reserved-cell.svg';
import redReservedCellSvg from '@/assets/red-reserved-cell.svg';
import { LocationHelper } from "@/models/helpers/location-helper";
import type { CellGrid } from "@/models/models/cell";
import type { JSX } from "react";
import { CELL_BACKGROUND_COLOR, CELL_STROKE_WIDTH } from "@/constants";


type GridProps = {
    cellGrid: CellGrid,
    cellLength: number
}

export const Grid = ({
    cellGrid,
    cellLength
}: GridProps) => {
	const [blueLaserCellImage] = useImage(blueLaserCellSvg);
	const [redLaserCellImage] = useImage(redLaserCellSvg);
	const [blueReservedCellImage] = useImage(blueReservedCellSvg);
	const [redReservedCellImage] = useImage(redReservedCellSvg);

	const getCellImage = (cellType: CellType) => {
		switch (cellType) {
			case 'reserved-blue':
				return blueReservedCellImage;
			case 'reserved-red':
				return redReservedCellImage;
			case 'laser-blue':
				return blueLaserCellImage;
			case 'laser-red':
				return redLaserCellImage;
			default:
				return null;
		}
	}

    const render = (): JSX.Element[] => {
        return cellGrid.flatMap((row) => {
            return row.map((cell) => {
                const cellPosition = PositionHelper.fromLocation(cell.location, cellLength);
                const cellImage = getCellImage(cell.type);
                const locationNotation = LocationHelper.toAN(cell.location);

                return (
                    <Rect 
                        key={locationNotation}
                        fill={CELL_BACKGROUND_COLOR}
                        x={cellPosition.x}
                        y={cellPosition.y}
                        width={cellLength}
                        height={cellLength}
                        stroke="black"
                        strokeWidth={CELL_STROKE_WIDTH}
                        strokeEnabled
                    />
                    // <Image
                    //     key={locationNotation}
                    //     id={`cg-${locationNotation}`}
                    //     x={cellPosition.x}
                    //     y={cellPosition.y}
                    //     image={cellImage}
                    //     fill={CELL_BACKGROUND_COLOR}
                    //     stroke={CELL_STROKE_COLOR}
                    //     strokeWidth={2}
                    //     strokeEnabled
                    //     width={cellLength}
                    //     height={cellLength}
                    // />
                )
            })
        })
    }

    return render();
}