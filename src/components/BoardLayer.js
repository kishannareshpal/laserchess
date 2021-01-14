import React, { useState, useEffect, useCallback } from 'react';
import { Layer, Stage, Image, Rect } from 'react-konva';
import NormalSlotSVG from '../assets/normal-slot.svg';
import RedHelixSlotSVG from '../assets/red-helix-slot.svg';
import RedLazerSlotSVG from '../assets/red-lazer-slot.svg';
import WhiteHelixSlotSVG from '../assets/white-helix-slot.svg';
import WhiteLazerSlotSVG from '../assets/white-lazer-slot.svg';
import useImage from 'use-image';

const arrangement = {
    columns: 10,
    rows: 8,
    slots: [
        ["white-lazer", "white-helix", "normal", "normal", "normal", "normal", "normal", "normal", "red-helix", "white-helix"],
        ["red-helix", "normal", "normal", "normal", "normal", "normal", "normal", "normal", "normal", "white-helix"],
        ["red-helix", "normal", "normal", "normal", "normal", "normal", "normal", "normal", "normal", "white-helix"],
        ["red-helix", "normal", "normal", "normal", "normal", "normal", "normal", "normal", "normal", "white-helix"],
        ["red-helix", "normal", "normal", "normal", "normal", "normal", "normal", "normal", "normal", "white-helix"],
        ["red-helix", "normal", "normal", "normal", "normal", "normal", "normal", "normal", "normal", "white-helix"],
        ["red-helix", "normal", "normal", "normal", "normal", "normal", "normal", "normal", "normal", "white-helix"],
        ["red-helix", "white-helix", "normal", "normal", "normal", "normal", "normal", "normal", "red-helix", "red-lazer"]
    ]
}

const BoardLayer = ({ boardSize }) => {
    const [slotSize] = useState(boardSize / arrangement.columns)
    const [normalSlotImage] = useImage(NormalSlotSVG);
    const [whiteLazerSlotImage] = useImage(WhiteLazerSlotSVG);
    const [whiteHelixSlotImage] = useImage(WhiteHelixSlotSVG);
    const [redLazerSlotImage] = useImage(RedLazerSlotSVG);
    const [redHelixSlotImage] = useImage(RedHelixSlotSVG);


    const getSlotImage = useCallback((slotType) => {
        switch (slotType) {
            case "white-helix":
                return whiteHelixSlotImage;

            case "red-helix":
                return redHelixSlotImage;
        
            case "white-lazer":
                return whiteLazerSlotImage;
            
            case "red-lazer":
                return redLazerSlotImage;

            default:
                return normalSlotImage;

        }
    }, [whiteHelixSlotImage, redHelixSlotImage, whiteLazerSlotImage, redLazerSlotImage, normalSlotImage])


    const drawSlotsGrid = useCallback(() => {
        const rows = []
        arrangement.slots.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                rows.push(
                    <Image image={getSlotImage(col)} 
                        x={0 + (slotSize * colIndex)}
                        y={0 + (slotSize * rowIndex)} 
                        width={slotSize} 
                        height={slotSize} />
                )
            })
        })
        return rows;
    }, [slotSize, getSlotImage])

    
    return (
        <Layer>
            { drawSlotsGrid() }
        </Layer>
    )
}

export default BoardLayer