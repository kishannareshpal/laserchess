import Konva from 'konva';
import React, { useEffect, useState, useCallback } from 'react';
import { Rect } from 'react-konva';


const Piece = ({ x, y, gridSize, margin = 20, color }) => {
    
	/**
     * Determine the X position of the piece in the grid,
     * according to the given column, and taking in
     * consideration the piece size.
     */
	const getX = useCallback(() => {
		return x * gridSize + (margin / 2);
	}, []);

	/**
     * Determine the Y position of the piece in the grid,
     * according to the given row, and taking in
     * consideration the piece size.
     */
	const getY = useCallback(() => {
		return y * gridSize + (margin / 2);
	}, []);

	/**
     * Determine the piece size according to the grid 
     * and the given margin for the piece inside the grid.
     */
	const getPieceSize = useCallback(() => {
		return gridSize - margin;
	}, []);

	return (
		<Rect draggable
			onDragEnd={(e) => {
				// After dragging, move the piece to the nearest grid
				// and centralize it.
				e.target.to({
					x: Math.round(e.target.x() / gridSize) * gridSize + (margin / 2),
					y: Math.round(e.target.y() / gridSize) * gridSize + (margin / 2),
					duration: 0.332,
					easing: Konva.Easings.BackEaseOut
				});
			}}
			fill={color}
			x={getX()} 
			y={getY()}
			width={getPieceSize()}
			height={getPieceSize()}
		/>
	);
};

export default Piece;
