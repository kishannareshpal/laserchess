import { Stage, Layer } from 'react-konva';
import BoardLayer from './components/BoardLayer';
import Piece from './components/Piece';


const boardSize = 700;
const gridSize = boardSize / 10; // 10 is the number of cols.

function App() {
	return (
		<Stage width={boardSize} height={boardSize}>
			<BoardLayer boardSize={boardSize} />

			<Layer>

				<Piece
					type=""
					x={2}
					y={2}
					color="red"
					gridSize={gridSize} />

			</Layer>
		</Stage>
	);
}

export default App;
