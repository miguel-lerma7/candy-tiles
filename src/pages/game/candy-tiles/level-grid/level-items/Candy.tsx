import red from './../../../../../assets/candies/red.png';
import orange from './../../../../../assets/candies/orange.png';
import yellow from './../../../../../assets/candies/yellow.png';
import green from './../../../../../assets/candies/green.png';
import blue from './../../../../../assets/candies/blue.png';
import purple from './../../../../../assets/candies/purple.png';
import candyBounceSFX from './../../../../../assets/audio/candyBounce.mp3';
import { useEffect, useRef, useState } from 'react';
import LevelItemFX from '../items-fx/LevelItemFX';
import { useRecoilValue } from 'recoil';
import { levelItemsState } from '../../../../../recoil/atoms/levelItems';
import useEffectAfterFirstRender from '../../../../../hooks/useEffectAfterFirstRender';
import anime from 'animejs';
import { ANIMATION_TIME_MS } from '../../../../../config';

const candyImages: { [key: string]: string } = {
	'Red': red,
	'Orange': orange,
	'Yellow': yellow,
	'Green': green,
	'Blue': blue,
	'Purple': purple,
};

export const CandyColors = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple'];

const animateItemSpawn = (element: HTMLElement): void => {
	anime({
		targets: element,
		translateX: [0, 0],
		translateY: ['-500%', '0%'],
		duration: 750,
		easing: 'easeOutBounce',
	});

	const candyBounceAudio = new Audio(candyBounceSFX);
	candyBounceAudio.volume = 0.15;
	candyBounceAudio.play();
};

type CandyProps = {
	color: CandyColor;
	initialIndex: number;
	id: string;
};

const Candy = ({ color, initialIndex, id }: CandyProps) => {
	const [showFX, setShowFX] = useState(false);
	const indexRef = useRef(initialIndex);
	const levelItems = useRecoilValue(levelItemsState);
	const elementRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		animateItemSpawn(elementRef.current as HTMLElement);
	}, []);

	useEffect(() => {
		indexRef.current = initialIndex;
	}, [initialIndex]);

	useEffect(() => {
		!!id && setShowFX(false);
	}, [id]);

	useEffectAfterFirstRender(() => {
		const itemMatched = !levelItems.some(x => x?.key === id);
		itemMatched && setShowFX(true);
	}, [levelItems]);

	return (
		<span className='relative w-full h-full block' ref={elementRef}>
			{showFX ? (
				<LevelItemFX color={color} maskSrc='/img/fx/doughnutShape.png'></LevelItemFX>
			) : (
				<img
					data-candy
					data-color={color}
					src={candyImages[color]}
					className='block w-full h-full m-0 select-none pointer-events-none relative'
				></img>
			)}
		</span>
	);
};

export default Candy;
