import React, { useState, useEffect, useCallback } from 'react';
import { Layer, Stage, Image, Rect } from 'react-konva';
import NormalSlotSVG from '../assets/normal-slot.svg';
import RedHelixSlotSVG from '../assets/red-helix-slot.svg';
import RedLaserSlotSVG from '../assets/red-laser-slot.svg';
import WhiteHelixSlotSVG from '../assets/white-helix-slot.svg';
import WhiteLaserSlotSVG from '../assets/white-laser-slot.svg';
import useImage from 'use-image';

const arrangement = {
	columns: 10,
	rows: 8,
	slots: [
		['white-laser', 'white-helix', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'red-helix', 'white-helix'],
		['red-helix', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'white-helix'],
		['red-helix', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'white-helix'],
		['red-helix', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'white-helix'],
		['red-helix', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'white-helix'],
		['red-helix', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'white-helix'],
		['red-helix', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'white-helix'],
		['red-helix', 'white-helix', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'red-helix', 'red-laser']
	]
};

const BoardLayer = ({ boardSize }) => {
	const [slotSize] = useState(boardSize / arrangement.columns);
	const [normalSlotImage] = useImage(NormalSlotSVG);
	const [whiteLaserSlotImage] = useImage(WhiteLaserSlotSVG);
	const [whiteHelixSlotImage] = useImage(WhiteHelixSlotSVG);
	const [redLaserSlotImage] = useImage(RedLaserSlotSVG);
	const [redHelixSlotImage] = useImage(RedHelixSlotSVG);


	const getSlotImage = useCallback((slotType) => {
		switch (slotType) {
		case 'white-helix':
			return whiteHelixSlotImage;

		case 'red-helix':
			return redHelixSlotImage;
        
		case 'white-laser':
			return whiteLaserSlotImage;
            
		case 'red-laser':
			return redLaserSlotImage;

		default:
			return normalSlotImage;

		}
	}, [whiteHelixSlotImage, redHelixSlotImage, whiteLaserSlotImage, redLaserSlotImage, normalSlotImage]);


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