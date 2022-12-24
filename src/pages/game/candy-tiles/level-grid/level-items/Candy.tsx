import red from './../../../../../assets/candies/red.png';
import orange from './../../../../../assets/candies/orange.png';
import yellow from './../../../../../assets/candies/yellow.png';
import green from './../../../../../assets/candies/green.png';
import blue from './../../../../../assets/candies/blue.png';
import purple from './../../../../../assets/candies/purple.png';
import { HtmlHTMLAttributes, useEffect, useRef, useState } from 'react';
import useFirstRender from '../../../../../hooks/useFirstRender';
import LevelItemFX from '../items-fx/LevelItemFX';
import levelManager from '../level-manager';
import { useRecoilValue } from 'recoil';
import { levelItemsState } from '../../../../../recoil/atoms/levelItems';
import useEffectAfterFirstRender from '../../../../../hooks/useEffectAfterFirstRender';
import gsap from 'gsap';

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
	console.log('should animtate');

	gsap.fromTo(
		element,
		{
			x: 0,
			y: 0,
			xPercent: 0,
			yPercent: -500,
		},
		{
			yPercent: 0,
			duration: 0.75,
			ease: 'bounce.out',
		}
	);
};

type CandyProps = {
	color: CandyColor;
	initialIndex: number;
	id: string;
};

const Candy = ({ color, initialIndex, id }: CandyProps) => {
	const [showFX, setShowFX] = useState(false);
	const indexRef = useRef(initialIndex);
	const firstRender = useFirstRender();
	const levelItems = useRecoilValue(levelItemsState);
	const elementRef = useRef<HTMLElement | null>(null);

	useEffectAfterFirstRender(() => {
		animateItemSpawn(elementRef.current as HTMLElement);
	}, []);

  useEffect(() => {
    initialIndex === 34 && console.log(initialIndex);
    
  })

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
		<span className="relative w-full h-full block" ref={elementRef}>
			{showFX ? (
				<LevelItemFX color={color} maskSrc="/img/fx/doughnutShape.png"></LevelItemFX>
			) : (
				<img
					data-candy
					data-color={color}
					src={candyImages[color]}
					className="block w-full h-full m-0 select-none pointer-events-none relative"
				></img>
			)}
		</span>
	);
};

export default Candy;
