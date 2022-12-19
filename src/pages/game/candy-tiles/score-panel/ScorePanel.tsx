import MoveCounter from './MoveCounter';
import ScoreBar from './ScoreBar';

const ScorePanel = () => {
	return (
		<div className="min-w-[180px] bg-black/25 rounded-lg p-[16px] items-center flex flex-col gap-[30px]">
			<ScoreBar></ScoreBar>
			<MoveCounter></MoveCounter>
		</div>
	);
};

export default ScorePanel;
