import { AiFillStar } from 'react-icons/ai';
import { useRecoilValue } from 'recoil';
import { scoreState } from '../../../../recoil/atoms/score';

const starLine =
	'before:content-[""] before:absolute before:block before:h-[10px] before:w-[2px] before:bg-white/30 before:left-[45%] before:bottom-[100%]';

const ScoreBar = () => {
	const score = useRecoilValue(scoreState);

	return (
		<div className='flex flex-col'>
			<div className='h-[30px] w-[150px] bg-purple p-[5px] relative rounded-lg '>
				<span className='bg-blue block w-full h-full scale-x-50 origin-left rounded-lg border-light-blue'></span>
				<span className='text-bone font-YellowCandy text-[13px] absolute block top-0 left-0 right-0 bottom-0 text-center leading-[30px] font-medium'>
					{score}
				</span>
				<span className={`absolute left-[20%] top-[115%] text-[#ffae17] ${starLine}`}>
					<AiFillStar className='[&>path]:stroke-1 [&>path]:stroke-white ' stroke='white' strokeWidth={2}></AiFillStar>
				</span>
				<span className={`absolute left-[40%] top-[115%] text-[#ffae17] ${starLine}`}>
					<AiFillStar></AiFillStar>
				</span>
				<span className={`absolute left-[80%] top-[115%] text-[#ffae17] ${starLine}`}>
					<AiFillStar></AiFillStar>
				</span>
			</div>
		</div>
	);
};

export default ScoreBar;
