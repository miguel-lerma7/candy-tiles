import { Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import GamePage from './pages/game';

const App = () => {
	return (
		<RecoilRoot>
			<main className='flex min-h-screen'>
				<Routes>
					<Route path='/' element={<GamePage></GamePage>}></Route>
				</Routes>
			</main>
		</RecoilRoot>
	);
};

export default App;
