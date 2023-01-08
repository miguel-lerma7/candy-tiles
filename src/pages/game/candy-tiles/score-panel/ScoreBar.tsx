import { easing } from '@mui/material';
import anime, { AnimeInstance } from 'animejs';
import { useEffect, useRef } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { useRecoilValue } from 'recoil';
import { scoreState } from '../../../../recoil/atoms/score';

const scoreObj = { score: 0 };
let scoreAnimation: AnimeInstance;
const animateScoreUpdate = (scoreElement: HTMLElement, newScore: number): void => {
	anime.remove(scoreAnimation);
	scoreAnimation = anime({
		targets: [scoreObj, scoreElement],
		score: newScore,
		color: {
			value: ['#ffbb00', '#fff'],
			duration: 1000,
			easing: 'linear',
		},
		easing: 'easeOutExpo',
		duration: 1000,
		round: true,
		update: () => {
			scoreElement.innerHTML = scoreObj.score.toString();
		},
	});
};

const starLine =
	'before:content-[""] before:absolute before:block before:h-[10px] before:w-[2px] before:bg-white/30 before:left-[45%] before:bottom-[100%]';

const ScoreBar = () => {
	const score = useRecoilValue(scoreState);
	const scoreNumberElementRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		animateScoreUpdate(scoreNumberElementRef.current as HTMLElement, score);
	}, [score]);

	return (
		<div className='flex flex-col'>
			<div className='h-[40px] w-[150px] bg-purple p-[5px] relative rounded-lg '>
				<span className='bg-blue block w-full h-full scale-x-50 origin-left rounded-lg border-light-blue'></span>
				<span
					className='text-bone font-YellowCandy text-[18px] absolute block top-0 left-0 right-0 bottom-0 text-center leading-[40px] font-medium'
					ref={scoreNumberElementRef}
				></span>
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
