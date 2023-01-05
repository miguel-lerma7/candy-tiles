import chocolateSprite from './../../../../../assets/candies/chocolate.png';
import { useEffect, useRef, useState } from 'react';
import chocolateMatchSFX from './../../../../../assets/audio/chocolateMatch.mp3';
import LevelItemFX from '../fx/LevelItemFX';
import useEffectAfterFirstRender from '../../../../../hooks/useEffectAfterFirstRender';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { levelItemsState } from '../../../../../recoil/atoms/levelItems';
import { latestSwappedCandyColor } from '../LevelManager';
import anime from 'animejs';
import { scoreState } from '../../../../../recoil/atoms/score';
import { scoreFxListState } from '../../../../../recoil/atoms/scoreFxList';
import uuid from 'react-uuid';
import { getItemColumnIndex, getItemRowIndex } from '../../../../../game-algorithms/tile-matching';

const chocolateMatchSound = new Audio(chocolateMatchSFX);
chocolateMatchSound.volume = 0.5;

const animateItemSpawn = (element: HTMLElement): void => {
	anime({
		targets: element,
		scale: [0, 2, 1],
		rotate: [360, 0],
		easing: 'easeOutBack',
		duration: 500,
	});
};

const CHOCHOLATE_SCORE = 100;

type ChocolateProps = {
	id: string;
	index: number;
};

const Chocolate = ({ id, index }: ChocolateProps) => {
	const [scale] = useState(0);
	const [showFX, setShowFX] = useState(false);
	const itemUsedRef = useRef(false);
	const levelItems = useRecoilValue(levelItemsState);
	const elementRef = useRef<HTMLImageElement | null>(null);
	const setScore = useSetRecoilState(scoreState);
	const setScoreFxList = useSetRecoilState(scoreFxListState);

	useEffect(() => {
		animateItemSpawn(elementRef.current as HTMLElement);
	}, []);

	useEffectAfterFirstRender(() => {
		const itemMatched = !levelItems.some(x => x?.key === id);
		if (itemMatched && !itemUsedRef.current) onItemMatch();
	}, [levelItems]);

	const onItemMatch = () => {
		setShowFX(true);
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

	return showFX ? (
		<LevelItemFX color={latestSwappedCandyColor} maskSrc='/img/fx/triangleShape.png'></LevelItemFX>
	) : (
		<img
			data-chocolate
			ref={elementRef}
			src={chocolateSprite}
			className='block w-full h-full m-0 select-none pointer-events-none duration-200'
		></img>
	);
};

export default Chocolate;
