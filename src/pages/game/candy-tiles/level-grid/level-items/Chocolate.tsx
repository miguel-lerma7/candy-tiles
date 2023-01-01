import chocolateSprite from './../../../../../assets/candies/chocolate.png';
import { useEffect, useRef, useState } from 'react';
import chocolateMatchSFX from './../../../../../assets/audio/chocolateMatch.mp3';
import LevelItemFX from '../items-fx/LevelItemFX';
import useEffectAfterFirstRender from '../../../../../hooks/useEffectAfterFirstRender';
import { useRecoilValue } from 'recoil';
import { levelItemsState } from '../../../../../recoil/atoms/levelItems';
import { latestSwappedCandyColor } from '../LevelManager';
import anime from 'animejs';

type ChocolateProps = {
	initialIndex: number;
	id: string;
};

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

const Chocolate = ({ initialIndex, id }: ChocolateProps) => {
	const [scale] = useState(0);
	const [showFX, setShowFX] = useState(false);
	const indexRef = useRef(initialIndex);
	const itemUsedRef = useRef(false);
	const levelItems = useRecoilValue(levelItemsState);
	const elementRef = useRef<HTMLImageElement | null>(null);

	useEffect(() => {
		animateItemSpawn(elementRef.current as HTMLElement);
	}, []);

	useEffect(() => {
		indexRef.current = initialIndex;
	}, [initialIndex]);

	useEffectAfterFirstRender(() => {
		const itemMatched = !levelItems.some(x => x?.key === id);
		if (!itemMatched || itemUsedRef.current) return;

		setShowFX(true);
		chocolateMatchSound.play();
	}, [levelItems]);

	return showFX ? (
		<LevelItemFX color={latestSwappedCandyColor} maskSrc='/img/fx/triangleShape.png'></LevelItemFX>
	) : (
		<img
			data-chocolate
			ref={elementRef}
			src={chocolateSprite}
			className='block w-full h-full m-0 select-none pointer-events-none duration-200'
			style={{
				transform: `scale(${scale})`,
			}}
		></img>
	);
};

export default Chocolate;
