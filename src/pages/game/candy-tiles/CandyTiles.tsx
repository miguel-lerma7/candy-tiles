import LevelContainer from './level-container';
import ScorePanel from './score-panel';

const CandyTiles = () => {
	return (
		<section className='w-[min(100%,860px)] max-h-full mr-auto rounded-lg shadow-lg flex items-center gap-x-[15px]'>
			<ScorePanel></ScorePanel>
			<LevelContainer></LevelContainer>
		</section>
	);
};

export default CandyTiles;
