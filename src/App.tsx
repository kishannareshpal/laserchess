import "./App.scss";
import { Board } from "./components/board/board";
import { Header } from "./components/layout/header";

export const App = () => {
	return (
		<div className="h-screen">
			<Header />

			<Board />

			{/* <Footer /> */}
		</div>
	);
}
