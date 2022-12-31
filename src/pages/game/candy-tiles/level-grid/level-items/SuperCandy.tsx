import superRed from './../../../../../assets/candies/super-red.png';
import superOrange from './../../../../../assets/candies/super-orange.png';
import superYellow from './../../../../../assets/candies/super-yellow.png';
import superGreen from './../../../../../assets/candies/super-green.png';
import superBlue from './../../../../../assets/candies/super-blue.png';
import superPurple from './../../../../../assets/candies/super-purple.png';
import superCandyMatchSFX from './../../../../../assets/audio/superCandyMatch.mp3';
import { useEffect, useRef, useState } from 'react';
import LevelItemFX from '../items-fx/LevelItemFX';
import { useRecoilValue } from 'recoil';
import { levelItemsState } from '../../../../../recoil/atoms/levelItems';
import useEffectAfterFirstRender from '../../../../../hooks/useEffectAfterFirstRender';
import anime from 'animejs';

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

const animateItemSpawn = (element: HTMLElement): void => {
	anime({
		targets: element,
		scale: [0, 1],
		rotate: [180, 0],
		easing: 'easeOutBack',
		duration: 750,
	});
};

type SuperCandyProps = {
	color: CandyColor;
	initialIndex: number;
	id: string;
};

const SuperCandy = ({ color, initialIndex, id }: SuperCandyProps) => {
	const [showFX, setShowFX] = useState(false);
	const indexRef = useRef(initialIndex);
	const itemUsedRef = useRef(false);
	const elementRef = useRef<HTMLImageElement | null>(null);
	const levelItems = useRecoilValue(levelItemsState);

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
		superCandyMatchSound.play();
	}, [levelItems]);

	return showFX ? (
		<LevelItemFX color={color} maskSrc='/img/fx/squareShape.png'></LevelItemFX>
	) : (
		<img
			ref={elementRef}
			data-candy
			data-color={color}
			src={candyImages[color]}
			className='block w-full h-full m-0 select-none pointer-events-none duration-200'
		></img>
	);
};

export default SuperCandy;
