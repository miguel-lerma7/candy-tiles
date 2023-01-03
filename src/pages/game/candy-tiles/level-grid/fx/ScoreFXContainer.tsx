import { useRecoilValue } from 'recoil';
import { scoreFxListState } from '../../../../../recoil/atoms/scoreFxList';
import ScoreFX from './ScoreFX';

const ScoreFXContainer = () => {
	const scoreFxList = useRecoilValue(scoreFxListState);

	return (
		<div className='pointer-events-none grid absolute top-0 left-0 w-full h-full'>
			{scoreFxList.map(score => (
				<ScoreFX color='' score={10} key={score.key} position={score.position}></ScoreFX>
			))}
		</div>
	);
};

export default ScoreFXContainer;
