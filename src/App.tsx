import { useEffect, useState } from "react";
import "./App.scss";
import { Game } from "./components/game";
import { Header } from "./components/layout/header";
import { game$ } from "./utils/store/game";
import { CellHelper } from "./models/helpers/cell-helper";

export const App = () => {
	const [ready, setReady] = useState(false);
	useEffect(() => {
		game$.startGame();
		CellHelper.prettyPrintCellGrid(game$.cellGrid.peek());
		setReady(true);
	}, []);

	return (
		<div className="h-screen">
			<Header />

			{ready ? (
				<Game />
			) : null}

			{/* <Footer /> */}
		</div>
	);
}
