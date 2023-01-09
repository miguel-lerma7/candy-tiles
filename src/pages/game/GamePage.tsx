import LevelContextProvider from '../../context/LevelContext';
import CandyTiles from './candy-tiles';
import LevelSelector from './level-selector';

const GamePage = () => {
	return (
		<section className="w-screen m-auto min-h-[600px] max-h-[700px] flex p-[20px] gap-x-[15px]">
			<LevelSelector></LevelSelector>
			<LevelContextProvider>
				<CandyTiles></CandyTiles>
			</LevelContextProvider>
		</section>
	);
};

export default GamePage;
