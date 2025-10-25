import { useEffect, useState } from "react";

import { Footer } from "./components/layout/footer";
import { Game } from "./components/game";
import { Header } from "./components/layout/header";
import { game$ } from "@/lib/store/game$";
import { useTheme } from "./lib/hooks/use-theme";

export const App = () => {
	const [ready, setReady] = useState(false);
	const theme = useTheme();

	useEffect(() => {
		game$.startGame();
		setReady(true);
	}, []);

	useEffect(() => {
		document.body.style.backgroundColor = theme.colors.page.background;
		document.body.style.color = theme.colors.page.text;
	}, [theme])

	return (
		<div className="flex flex-1 p-4 flex-col h-screen gap-6">
			<Header />

			{ready ? (
				<div className="flex flex-1">
					<Game />
				</div>
			) : null}

			<Footer />
		</div>
	);
};