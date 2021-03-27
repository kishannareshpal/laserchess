import React, { useCallback } from "react";
import { Layer, Image, Rect } from "react-konva";
import { CellTypesEnum, PlayerTypesEnum } from "../models/Enums";
import RedReservedCellSVG from "../assets/red-reserved-cell.svg";
import RedLaserCellSVG from "../assets/red-laser-cell.svg";
import BlueReservedCellSVG from "../assets/blue-reserved-cell.svg";
import BlueLaserCellSVG from "../assets/blue-laser-cell.svg";
import useImage from "use-image";
import BGN from "../utils/BGN";
import Location from "../models/Location";


/**
 * The number of columns of the board
 * @constant
 * @type {number}
 */
const columns = 10;

/**
 * The number of rows of the board
 * @constant
 * @type {number}
 */
const rows = 8;

/**
 * The board cell arrangement bgn
 * @constant
 * @type {string}
 */
const boardGridNotationText = "lR6rR/r8R/r8R/r8R/r8R/r8R/r8R/rR6rL";
const boardGridNotation = BGN.parse(boardGridNotationText);

/**
 * The hex color of the cell background
 * @constant
 * @type {string} 
 */
const cellBackgroundColor = "#313134"; // a sort of dark grey


/**
 * The board layer
 */
const BoardLayer = ({ cellSize }) => {
	const [blueLaserCellImage] = useImage(BlueLaserCellSVG);
	const [blueReservedCellImage] = useImage(BlueReservedCellSVG);
	const [redLaserCellImage] = useImage(RedLaserCellSVG);
	const [redReservedCellImage] = useImage(RedReservedCellSVG);


	const getCellImage = useCallback((cellType, color) => {
		switch (cellType) {
			case CellTypesEnum.RESERVED:
				if (color === PlayerTypesEnum.BLUE) {
					return blueReservedCellImage;
				} else {
					return redReservedCellImage;
				}

			case CellTypesEnum.LASER:
				if (color === PlayerTypesEnum.BLUE) {
					return blueLaserCellImage;
				} else {
					return redLaserCellImage;
				}

			default:
				// CellTypesEnum.NORMAL
				// No image for this cell. It's a normal cell. So we just return null.
				return null;
		}

	}, [blueLaserCellImage, blueReservedCellImage, redLaserCellImage, redReservedCellImage]);


	const drawGrid = useCallback(() => {
		const rows = [];
		boardGridNotation.forEach((row, rowIndex) => {
			row.forEach((col, colIndex) => {
				const cellType = col.type;
				const cellTypeColor = col.color;
				rows.push(
					<Image key={`cell--${rowIndex}${colIndex}`}
						fill={cellBackgroundColor}
						x={Location.getX(colIndex, cellSize, false)}
						y={Location.getY(rowIndex, cellSize, false)}
						stroke="#000"
						image={getCellImage(cellType, cellTypeColor)}
						strokeWidth={1}
						strokeEnabled={true}
						width={cellSize}
						height={cellSize} />
				);
			});
		});
		return rows;
	}, [cellSize, getCellImage]);


	return (
		<Layer>
			{drawGrid()}
		</Layer>
	);
};

export default BoardLayer;