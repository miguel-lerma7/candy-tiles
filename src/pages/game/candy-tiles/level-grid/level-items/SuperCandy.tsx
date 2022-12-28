import superRed from './../../../../../assets/candies/super-red.png';
import superOrange from './../../../../../assets/candies/super-orange.png';
import superYellow from './../../../../../assets/candies/super-yellow.png';
import superGreen from './../../../../../assets/candies/super-green.png';
import superBlue from './../../../../../assets/candies/super-blue.png';
import superPurple from './../../../../../assets/candies/super-purple.png';
import superCandyMatchSFX from './../../../../../assets/audio/superCandyMatch.mp3';
import { useEffect, useRef, useState } from 'react';
import useFirstRender from '../../../../../hooks/useFirstRender';
import levelManager from '../level-manager';
import { getHorizontalAndVerticalItems } from '../../../../../game-algorithms/tile-matching';
import LevelItemFX from '../items-fx/LevelItemFX';
import { useRecoilValue } from 'recoil';
import { swappedItemsState } from '../../../../../recoil/atoms/swappedItems';

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

type SuperCandyProps = {
	color: CandyColor;
	initialIndex: number;
  id: string
};

const SuperCandy = ({ color, initialIndex, id }: SuperCandyProps) => {
	const [scale, setScale] = useState(0);
	const [showFX, setShowFX] = useState(false);
	const firstRender = useFirstRender();
	const indexRef = useRef(initialIndex);
	const itemUsedRef = useRef(false);
  const swappedItems = useRecoilValue(swappedItemsState);

	useEffect(() => {
		firstRender && setScale(1);
		levelManager.subscribeItemsChange(onItemsChange);
		return () => {
			levelManager.unsubscribeItemsChange(onItemsChange);
		};
	}, []);

	useEffect(() => {
		indexRef.current = initialIndex;
	}, [initialIndex]);

	const onItemsChange = () => {
		const itemMatched = !levelManager.levelData.items.some(x => x?.key === id);
		if (itemMatched && !itemUsedRef.current) {
			setShowFX(true);
			itemUsedRef.current = true;
			const intersectingItems = getHorizontalAndVerticalItems(indexRef.current);
			superCandyMatchSound.play();
			levelManager.setItems(
				levelManager.levelData.items.map((x, i) => (intersectingItems.includes(i) ? null : x)),
				true
			);
		}
	};

	return showFX ? (
		<LevelItemFX color={color} maskSrc="/img/fx/squareShape.png"></LevelItemFX>
	) : (
		<img
			data-candy
			data-color={color}
			src={candyImages[color]}
			className="block w-full h-full m-0 select-none pointer-events-none duration-200"
			style={{
				transform: `scale(${scale})`,
			}}
		></img>
	);
};

export default SuperCandy;
