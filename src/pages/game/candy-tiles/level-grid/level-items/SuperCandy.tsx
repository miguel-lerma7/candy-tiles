import superRed from './../../../../../assets/candies/super-red.png';
import superOrange from './../../../../../assets/candies/super-orange.png';
import superYellow from './../../../../../assets/candies/super-yellow.png';
import superGreen from './../../../../../assets/candies/super-green.png';
import superBlue from './../../../../../assets/candies/super-blue.png';
import superPurple from './../../../../../assets/candies/super-purple.png';
import superCandyMatchSFX from './../../../../../assets/audio/superCandyMatch.mp3';
import { useEffect, useRef, useState } from 'react';
import LevelItemFX from '../fx/LevelItemFX';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { levelItemsState } from '../../../../../recoil/atoms/levelItems';
import useEffectAfterFirstRender from '../../../../../hooks/useEffectAfterFirstRender';
import anime, { AnimeInstance } from 'animejs';
import { scoreState } from '../../../../../recoil/atoms/score';
import { scoreFxListState } from '../../../../../recoil/atoms/scoreFxList';
import uuid from 'react-uuid';
import { getItemColumnIndex, getItemRowIndex } from '../../../../../game-algorithms/tile-matching';

const candyImages: { [key: string]: string } = {
	'Red': superRed,
	'Orange': superOrange,
	'Yellow': superYellow,
	'Green': superGreen,
	'Blue': superBlue,
	'Purple': superPurple,
};

const superCandyMatchSound = new Audio(superCandyMatchSFX);

export const CandyColors = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple'];

const animateItemSpawn = (element: HTMLElement, onComplete: () => void): void => {
	anime({
		targets: element,
		scale: [0, 1],
		rotate: [180, -10],
		easing: 'easeOutBack',
		duration: 750,
		complete: onComplete,
	});
};

const animateSuperCandyRotation = (element: HTMLElement): AnimeInstance => {	
	const animation = anime({
		targets: element,
		rotate: [-10, 10],
		duration: 1500,
		easing: 'easeInOutCubic',
		direction: 'alternate',
		loop: true,
	});
	return animation;
};

const SUPER_CANDY_SCORE = 50;

type SuperCandyProps = {
	color: CandyColor;
	id: string;
	index: number;
};

const SuperCandy = ({ color, id, index }: SuperCandyProps) => {
	const [showFX, setShowFX] = useState(false);
	const itemUsedRef = useRef(false);
	const elementRef = useRef<HTMLImageElement | null>(null);
	const levelItems = useRecoilValue(levelItemsState);
	const rotateAnimationRef = useRef<null | AnimeInstance>(null);
	const setScore = useSetRecoilState(scoreState);
	const setScoreFxList = useSetRecoilState(scoreFxListState);

	useEffect(() => {
		animateItemSpawn(elementRef.current as HTMLElement, () => {
			rotateAnimationRef.current = animateSuperCandyRotation(elementRef.current as HTMLElement);
		});

		return () => {
			anime.remove(rotateAnimationRef.current);
		};
	}, []);

	useEffectAfterFirstRender(() => {
		const itemMatched = !levelItems.some(x => x?.key === id);
		itemMatched && !itemUsedRef.current && onItemMatch();
	}, [levelItems]);

	const onItemMatch = () => {
		setShowFX(true);
		setScore(score => score + SUPER_CANDY_SCORE);
		superCandyMatchSound.play();
		setScoreFxList(list => [
			...list,
			{
				color,
				key: uuid(),
				position: [(getItemColumnIndex(index) - 1) * 100, (getItemRowIndex(index) - 1) * 100],
				score: SUPER_CANDY_SCORE,
			},
		]);
	};

	return showFX ? (
		<LevelItemFX color={color} maskSrc='/img/fx/squareShape.png'></LevelItemFX>
	) : (
		<img
			ref={elementRef}
			data-candy
			data-color={color}
			src={candyImages[color]}
			className='block w-full h-full m-0 select-none pointer-events-none'
		></img>
	);
};

export default SuperCandy;
