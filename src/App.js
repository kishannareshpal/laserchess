import { Stage, Layer } from 'react-konva';
import BoardLayer from './components/BoardLayer';
import Piece from './components/Piece';


const boardSize = 700;

function App() {
	return (
		<Stage width={boardSize} height={boardSize}>
			<BoardLayer boardSize={boardSize} />

			<Layer>
                
				{
					[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(col => (
						<Piece
							col={col}
							row={7}
							color="blue"
							gridSize={boardSize / 10} />
					))
				}

			</Layer>
		</Stage>
	);
}

export default App;
