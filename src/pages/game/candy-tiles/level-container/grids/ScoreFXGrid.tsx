import { useRecoilValue } from 'recoil';
import { scoreFxListState } from '../../../../../recoil/atoms/scoreFxList';
import ScoreFX from '../fx/ScoreFX';

const ScoreFXGrid = () => {
	const scoreFxList = useRecoilValue(scoreFxListState);

	return (
		<div className='pointer-events-none grid absolute top-0 left-0 w-full h-full'>
			{scoreFxList.map(score => (
				<ScoreFX color={score.color} score={score.score} key={score.key} position={score.position} id={score.key}></ScoreFX>
			))}
		</div>
	);
};

export default ScoreFXGrid;
