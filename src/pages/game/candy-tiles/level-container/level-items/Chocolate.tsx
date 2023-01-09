import chocolateSprite from './../../../../../assets/img/candies/chocolate.png';
import { useEffect, useRef, useState } from 'react';
import chocolateMatchSFX from './../../../../../assets/audio/chocolateMatch.mp3';
import useEffectAfterFirstRender from '../../../../../hooks/useEffectAfterFirstRender';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { levelItemsState } from '../../../../../recoil/atoms/levelItems';
import anime, { AnimeInstance } from 'animejs';
import { scoreState } from '../../../../../recoil/atoms/score';
import { scoreFxListState } from '../../../../../recoil/atoms/scoreFxList';
import uuid from 'react-uuid';
import { getItemColumnIndex, getItemRowIndex } from '../../../../../game-algorithms/tile-matching';

const chocolateMatchSound = new Audio(chocolateMatchSFX);
chocolateMatchSound.volume = 0.5;

const animateItemSpawn = (element: HTMLElement, onComplete: () => void): void => {
	anime({
		targets: element,
		scale: [0, 1.2, 1],
		easing: 'easeOutBack',
		duration: 500,
		complete: onComplete,
	});
};

const animateChocolateScale = (element: HTMLElement): AnimeInstance => {
	const animation = anime({
		targets: element,
		rotate: [0, 360],
		duration: 10000,
		loop: true,
		easing: 'linear',
		direction: 'normal',
	});

	return animation;
};

const CHOCHOLATE_SCORE = 100;

type ChocolateProps = {
	id: string;
	index: number;
};

const Chocolate = ({ id, index }: ChocolateProps) => {
	const [show, setShow] = useState(true);
	const itemUsedRef = useRef(false);
	const levelItems = useRecoilValue(levelItemsState);
	const elementRef = useRef<HTMLImageElement | null>(null);
	const spinAnimationRef = useRef<null | AnimeInstance>(null);
	const setScore = useSetRecoilState(scoreState);
	const setScoreFxList = useSetRecoilState(scoreFxListState);

	useEffect(() => {
		animateItemSpawn(elementRef.current as HTMLElement, () => {
			spinAnimationRef.current = animateChocolateScale(elementRef.current as HTMLElement);
		});

		return () => {
			anime.remove(spinAnimationRef.current);
		};
	}, []);

	useEffectAfterFirstRender(() => {
		const itemMatched = !levelItems.some(x => x?.key === id);
		if (itemMatched && !itemUsedRef.current) onItemMatch();
	}, [levelItems]);

	const onItemMatch = () => {
		setShow(false);
		setScore(score => score + CHOCHOLATE_SCORE);
		chocolateMatchSound.play();
		setScoreFxList(list => [
			...list,
			{
				color: 'White',
				key: uuid(),
				position: [(getItemColumnIndex(index) - 1) * 100, (getItemRowIndex(index) - 1) * 100],
				score: CHOCHOLATE_SCORE,
			},
		]);
	};

	return (
		<img
			data-chocolate
			ref={elementRef}
			src={chocolateSprite}
			className='w-full h-full m-0 select-none pointer-events-none'
			style={{
				display: show ? 'block' : 'none',
			}}
		></img>
	);
};

export default Chocolate;
