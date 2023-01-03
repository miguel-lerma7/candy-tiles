import red from './../../../../../assets/candies/red.png';
import orange from './../../../../../assets/candies/orange.png';
import yellow from './../../../../../assets/candies/yellow.png';
import green from './../../../../../assets/candies/green.png';
import blue from './../../../../../assets/candies/blue.png';
import purple from './../../../../../assets/candies/purple.png';
import candyBounceSFX from './../../../../../assets/audio/candyBounce.mp3';
import { useEffect, useRef, useState } from 'react';
import LevelItemFX from '../fx/LevelItemFX';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { levelItemsState } from '../../../../../recoil/atoms/levelItems';
import useEffectAfterFirstRender from '../../../../../hooks/useEffectAfterFirstRender';
import anime from 'animejs';
import { userInteractedWithDocumentState } from '../../../../../recoil/atoms/userInteractedWithDocument';
import { scoreState } from '../../../../../recoil/atoms/score';
import { scoreFxListState } from '../../../../../recoil/atoms/scoreFxList';
import uuid from 'react-uuid';
import { getItemColumnIndex, getItemRowIndex } from '../../../../../game-algorithms/tile-matching';

const candyImages: { [key: string]: string } = {
	'Red': red,
	'Orange': orange,
	'Yellow': yellow,
	'Green': green,
	'Blue': blue,
	'Purple': purple,
};

export const CandyColors = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple'];

let activeBounceSounds = 0;
const activeBounceSoundsLimit = 10;
const playCandyBounchSound = (userInteractedWithDocument: boolean) => {
	if (!userInteractedWithDocument || activeBounceSounds > activeBounceSoundsLimit) return;
	const candyBounceAudio = new Audio(candyBounceSFX);
	candyBounceAudio.volume = 0.15;
	candyBounceAudio.play();
	candyBounceAudio.onended = () => (activeBounceSounds = -1);
	activeBounceSounds += 1;
};

const animateItemSpawn = (element: HTMLElement): void => {
	anime({
		targets: element,
		translateX: [0, 0],
		translateY: ['-500%', '0%'],
		duration: 750,
		easing: 'easeOutBounce',
	});
};

type CandyProps = {
	color: CandyColor;
	id: string;
};

const CANDY_SCORE = 10;

const Candy = ({ color, id }: CandyProps) => {
	const [showFX, setShowFX] = useState(false);
	const levelItems = useRecoilValue(levelItemsState);
	const elementRef = useRef<HTMLElement | null>(null);
	const userInteractedWithDocument = useRecoilValue(userInteractedWithDocumentState);
	const setScore = useSetRecoilState(scoreState);
	const setScoreFxList = useSetRecoilState(scoreFxListState);

	useEffect(() => {
		animateItemSpawn(elementRef.current as HTMLElement);
		playCandyBounchSound(userInteractedWithDocument);
	}, []);

	useEffect(() => {
		!!id && setShowFX(false);
	}, [id]);

	useEffectAfterFirstRender(() => {
		const itemMatched = !levelItems.some(x => x?.key === id);
		itemMatched && onItemMatch();
	}, [levelItems]);

	const onItemMatch = () => {		
		setScore(score => score + CANDY_SCORE);
		setShowFX(true);
		setScoreFxList(list => [
			...list,
			{
				color: 'white',
				key: uuid(),
				position: [(getItemColumnIndex(1) - 1) * 100, (getItemRowIndex(1) - 1) * 100],
				score: CANDY_SCORE,
			},
		]);
	};

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
