import anime from 'animejs';
import { useEffect, useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import { COLUMN_NUMBER, ROW_NUMBER } from '../../../../../config';
import { scoreFxListState } from '../../../../../recoil/atoms/scoreFxList';

type ScoreFXProps = {
	score: number;
	color: string;
	position: [number, number];
	id: string;
};

const ScoreFX = ({ score, color, position, id }: ScoreFXProps) => {
	const setScoreFxList = useSetRecoilState(scoreFxListState);
	const scoreElementRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		animateScore();
	}, []);

	const animateScore = (): void => {
		anime({
			targets: scoreElementRef.current,
			translateY: ['0%', '-100%'],
			opacity: [1, 0],
			duration: 500,
			easing: 'linear',
			complete: () => setScoreFxList(list => list.filter(x => x.key !== id)),
		});
	};

	return (
		<div
			className='absolute flex'
			style={{
				transform: `translate(${position[0]}%, ${position[1]}%)`,
				width: `calc(100%/${COLUMN_NUMBER})`,
				height: `calc(100%/${ROW_NUMBER})`,
			}}
		>
			<span ref={scoreElementRef} className='text-white text-[24px] font-bold text-center m-auto font-LilyScriptOne'>
				{score}
			</span>
		</div>
	);
};

export default ScoreFX;
