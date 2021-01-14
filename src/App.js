import './App.scss';
import { Stage, Layer } from 'react-konva';
import BoardLayer from './components/BoardLayer';


const boardSize = 700;

function App() {
  return (
    <Stage width={boardSize} height={boardSize}>
        <BoardLayer boardSize={boardSize} />
    </Stage>
  );
}

export default App;
