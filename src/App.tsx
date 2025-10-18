import { useEffect, useRef, useState } from "react";
// import "./App.scss";
import { Game } from "./components/game";
import { Header } from "./components/layout/header";
import { game$ } from "./utils/store/game$";

export const App = () => {
	const [ready, setReady] = useState(false);
	useEffect(() => {
		game$.startGame();
		// CellHelper.prettyPrintCellGrid(game$.cellGrid.peek());
		setReady(true);
	}, []);

	// const canvasRef = useRef<HTMLCanvasElement>(null);

	// useEffect(() => {
	// 	const context = canvasRef.current.getContext('2d');

	// 	function drawGrid(lineWidth, cellWidth, cellHeight, color) {
	// 		const width = 400;
	// 		const height = 400;

	// 		context.strokeStyle = color;
	// 		context.lineWidth = lineWidth;

	// 		const offset = lineWidth / 2;

	// 		// Draw vertical lines
	// 		for (let x = 0; x <= width; x += cellWidth) {
	// 			const xPos = Math.min(width - offset, x + offset);
	// 			context.beginPath();
	// 			context.moveTo(xPos, 0);
	// 			context.lineTo(xPos, height);
	// 			context.stroke();
	// 		}

	// 		// Draw horizontal lines
	// 		for (let y = 0; y <= height; y += cellHeight) {
	// 			const yPos = Math.min(height - offset, y + offset);
	// 			context.beginPath();
	// 			context.moveTo(0, yPos);
	// 			context.lineTo(width, yPos);
	// 			context.stroke();
	// 		}

	// 		// Optional: draw explicit border to ensure clean outer edge
	// 		context.strokeRect(offset, offset, width - lineWidth, height - lineWidth);
	// 	}

	// 	const strokeWidth = 10;
	// 	const cellLength = 100;

	// 	drawGrid(strokeWidth, cellLength, cellLength, 'white');
	// }, []);

	return (
		<div className="flex flex-1 p-4 flex-col h-screen bg-purple-600 gap-6">
			<div className="flex">
				<Header />
			</div>

			{/* <canvas ref={canvasRef} width={400} height={400} /> */}

			{ready ? (
				<div className="flex flex-1">
					<Game />
				</div>
			) : null}

			{/* <Footer /> */}
		</div>
	);
}
