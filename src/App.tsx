import { useEffect, useState } from "react";
import { Game } from "./components/game";
import { Header } from "./components/layout/header";
import { game$ } from "@/lib/store/game$";
import { useTheme } from "./lib/hooks/use-theme";

export const App = () => {
	const theme = useTheme();

	const [ready, setReady] = useState(false);
	useEffect(() => {
		game$.startGame();
		setReady(true);
	}, []);

	return (
		<div
			className="flex flex-1 p-4 flex-col h-screen gap-6"
			style={{ backgroundColor: theme.colors.page.background }}
		>
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
