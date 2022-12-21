import { Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import GamePage from './pages/game';

export default () => {
	return (
		<RecoilRoot>
			<main className="flex min-h-screen">
				<Routes>
					<Route path="/" element={<GamePage></GamePage>}></Route>
				</Routes>
			</main>
		</RecoilRoot>
	);
};
