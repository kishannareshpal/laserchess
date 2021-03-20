import React, { useCallback } from "react";
import { Layer, Image, Rect } from "react-konva";
import { CellTypesEnum, PlayerTypesEnum } from "../models/Enums";
import NormalCellSVG from "../assets/cell.svg";
import RedReservedCellSVG from "../assets/red-reserved-cell.svg";
import RedLaserCellSVG from "../assets/red-laser-cell.svg";
import BlueReservedCellSVG from "../assets/blue-reserved-cell.svg";
import BlueLaserCellSVG from "../assets/blue-laser-cell.svg";
import useImage from "use-image";
import BGN from "../utils/BGN";


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
 * The board
 */
const BoardLayer = ({ boardSize, gridSize }) => {
	const [normalCellImage] = useImage(NormalCellSVG);
	const [blueLaserCellImage] = useImage(BlueLaserCellSVG);
	const [blueReservedCellImage] = useImage(BlueReservedCellSVG);
	const [redLaserCellImage] = useImage(RedLaserCellSVG);
	const [redReservedCellImage] = useImage(RedReservedCellSVG);


	const getCellImage = useCallback((cellType, color) => {
		switch (cellType) {
			case CellTypesEnum.HELIX:
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
					<Image key={`slot--${rowIndex}${colIndex}`}
						fill={cellBackgroundColor}
						x={gridSize * colIndex}
						y={gridSize * rowIndex}
						stroke="grey"
						image={getCellImage(cellType, cellTypeColor)}
						strokeWidth={1}
						strokeEnabled={true}
						width={gridSize}
						height={gridSize} />
				);
			});
		});
		return rows;
	}, [gridSize, getCellImage]);


	return (
		<Layer>
			{drawGrid()}
		</Layer>
	);
};

export default BoardLayer;