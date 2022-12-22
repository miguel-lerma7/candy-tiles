import red from './../../../../../assets/candies/red.png';
import orange from './../../../../../assets/candies/orange.png';
import yellow from './../../../../../assets/candies/yellow.png';
import green from './../../../../../assets/candies/green.png';
import blue from './../../../../../assets/candies/blue.png';
import purple from './../../../../../assets/candies/purple.png';
import { useEffect, useRef, useState } from 'react';
import useFirstRender from '../../../../../hooks/useFirstRender';
import LevelItemFX from '../items-fx/LevelItemFX';
import levelManager from '../level-manager';

const candyImages: { [key: string]: string } = {
	'Red': red,
	'Orange': orange,
	'Yellow': yellow,
	'Green': green,
	'Blue': blue,
	'Purple': purple,
};

export const CandyColors = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple'];

type CandyProps = {
	color: CandyColor;
	initialIndex: number;
	id: string;
};

const Candy = ({ color, initialIndex, id }: CandyProps) => {
	const [positionY, setPositionY] = useState(-500);
	const [showFX, setShowFX] = useState(false);
	const indexRef = useRef(initialIndex);
	const firstRender = useFirstRender();

	useEffect(() => {
		firstRender && setPositionY(0);
		levelManager.subscribeItemsChange(onLevelItemsChanged);

		return () => {
			levelManager.unsubscribeItemsChange(onLevelItemsChanged);
		};
	}, []);

	useEffect(() => {
		indexRef.current = initialIndex;
	}, [initialIndex]);

	const onLevelItemsChanged = (): void => {    
		const itemMatched = !levelManager.levelData.items.some(x => x?.key === id);
		itemMatched && setShowFX(true);
	};

	return (
		<span className="relative w-full h-full block">
			{showFX ? (
				<LevelItemFX color={color} maskSrc="/img/fx/doughnutShape.png"></LevelItemFX>
			) : (
				<img
					data-candy
					data-color={color}
					src={candyImages[color]}
					className="block w-full h-full m-0 select-none pointer-events-none relative"
					style={{
						transform: `translateY(${positionY}%)`,
					}}
				></img>
			)}
		</span>
	);
};

export default Candy;
