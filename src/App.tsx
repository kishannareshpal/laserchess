import { useEffect, useState } from "react";
import { Game } from "./components/game";
import { Header } from "./components/layout/header";
import { game$ } from "./utils/store/game$";

export const App = () => {
	const [ready, setReady] = useState(false);
	useEffect(() => {
		game$.startGame();
		setReady(true);
	}, []);

	return (
		<div className="flex flex-1 p-4 flex-col h-screen bg-purple-600 gap-6">
			<Header />

			{ready ? (
				<div className="flex flex-1">
					<Game />
				</div>
			) : null}

			{/* <Footer /> */}
		</div>
	);
}
