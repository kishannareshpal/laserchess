import React, { useState, useEffect, useCallback } from 'react';
import { Layer, Stage, Image, Rect } from 'react-konva';
import NormalSlotSVG from '../assets/normal-slot.svg';
import RedHelixSlotSVG from '../assets/red-helix-slot.svg';
import RedLaserSlotSVG from '../assets/red-laser-slot.svg';
import BlueHelixSlotSVG from '../assets/blue-helix-slot.svg';
import BlueLaserSlotSVG from '../assets/blue-laser-slot.svg';
import useImage from 'use-image';

const arrangement = {
	columns: 10,
	rows: 8,
	slots: [
		['blue-laser', 'blue-helix', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'red-helix', 'blue-helix'],
		['red-helix', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'blue-helix'],
		['red-helix', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'blue-helix'],
		['red-helix', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'blue-helix'],
		['red-helix', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'blue-helix'],
		['red-helix', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'blue-helix'],
		['red-helix', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'blue-helix'],
		['red-helix', 'blue-helix', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'red-helix', 'red-laser']
	]
};

const BoardLayer = ({ boardSize }) => {
	const [slotSize] = useState(boardSize / arrangement.columns);
	const [normalSlotImage] = useImage(NormalSlotSVG);
	const [blueLaserSlotImage] = useImage(BlueLaserSlotSVG);
	const [blueHelixSlotImage] = useImage(BlueHelixSlotSVG);
	const [redLaserSlotImage] = useImage(RedLaserSlotSVG);
	const [redHelixSlotImage] = useImage(RedHelixSlotSVG);


	const getSlotImage = useCallback((slotType) => {
		switch (slotType) {
		case 'blue-helix':
			return blueHelixSlotImage;

		case 'red-helix':
			return redHelixSlotImage;
        
		case 'blue-laser':
			return blueLaserSlotImage;
            
		case 'red-laser':
			return redLaserSlotImage;

		default:
			return normalSlotImage;

		}
	}, [blueHelixSlotImage, redHelixSlotImage, blueLaserSlotImage, redLaserSlotImage, normalSlotImage]);


	const drawSlotsGrid = useCallback(() => {
		const rows = [];
		arrangement.slots.forEach((row, rowIndex) => {
			row.forEach((col, colIndex) => {
				rows.push(
					<Image key={`${rowIndex}${colIndex}`} image={getSlotImage(col)} 
						x={0 + (slotSize * colIndex)}
						y={0 + (slotSize * rowIndex)} 
						width={slotSize} 
						height={slotSize} />
				);
			});
		});
		return rows;
	}, [slotSize, getSlotImage]);

    
	return (
		<Layer>
			{ drawSlotsGrid() }
		</Layer>
	);
};

export default BoardLayer;