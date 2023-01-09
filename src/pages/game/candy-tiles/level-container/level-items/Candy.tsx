import red from './../../../../../assets/img/candies/red.png';
import orange from './../../../../../assets/img/candies/orange.png';
import yellow from './../../../../../assets/img/candies/yellow.png';
import green from './../../../../../assets/img/candies/green.png';
import blue from './../../../../../assets/img/candies/blue.png';
import purple from './../../../../../assets/img/candies/purple.png';
import candyBounceSFX from './../../../../../assets/audio/candyBounce.mp3';
import { useEffect, useRef, useState } from 'react';
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
	index: number;
};

const CANDY_SCORE = 10;

const Candy = ({ color, id, index }: CandyProps) => {
	const [show, setShow] = useState(false);
	const levelItems = useRecoilValue(levelItemsState);
	const elementRef = useRef<HTMLElement | null>(null);
	const userInteractedWithDocument = useRecoilValue(userInteractedWithDocumentState);
	const setScore = useSetRecoilState(scoreState);
	const setScoreFxList = useSetRecoilState(scoreFxListState);
	const itemUsed = useRef(false);

	useEffect(() => {
		animateItemSpawn(elementRef.current as HTMLElement);
		playCandyBounchSound(userInteractedWithDocument);
	}, []);

	useEffect(() => {
		!!id && setShow(true);
	}, [id]);

	useEffectAfterFirstRender(() => {
		if (itemUsed.current) return;
		const itemMatched = !levelItems.some(x => x?.key === id);
		itemMatched && onItemMatch();
	}, [levelItems]);

	const onItemMatch = () => {
		itemUsed.current = true;
		setScore(score => score + CANDY_SCORE);
		setShow(false);
		setScoreFxList(list => [
			...list,
			{
				color,
				key: uuid(),
				position: [(getItemColumnIndex(index) - 1) * 100, (getItemRowIndex(index) - 1) * 100],
				score: CANDY_SCORE,
			},
		]);
	};

	return (
		<span className='relative w-full h-full block' ref={elementRef}>
			{show ? (
				<img
					data-candy
					data-color={color}
					src={candyImages[color]}
					className='block w-full h-full m-0 select-none pointer-events-none relative'
				></img>
			) : (
				<></>
			)}
		</span>
	);
};

export default Candy;
