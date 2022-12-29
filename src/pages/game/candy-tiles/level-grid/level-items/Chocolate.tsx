import chocolateSprite from './../../../../../assets/candies/chocolate.png';
import { useEffect, useRef, useState } from 'react';
import useFirstRender from '../../../../../hooks/useFirstRender';
import LevelManager from '../level-manager';
import chocolateMatchSFX from './../../../../../assets/audio/chocolateMatch.mp3';
import LevelItemFX from '../items-fx/LevelItemFX';
import levelManager from '../level-manager';
import useEffectAfterFirstRender from '../../../../../hooks/useEffectAfterFirstRender';
import { useRecoilValue } from 'recoil';
import { levelItemsState } from '../../../../../recoil/atoms/levelItems';

type ChocolateProps = {
	initialIndex: number;
	id: string;
};

const chocolateMatchSound = new Audio(chocolateMatchSFX);
chocolateMatchSound.volume = 0.5;

const Chocolate = ({ initialIndex, id }: ChocolateProps) => {
	const [scale, setScale] = useState(0);
	const [showFX, setShowFX] = useState(false);
	const indexRef = useRef(initialIndex);
	const itemUsedRef = useRef(false);
	const levelItems = useRecoilValue(levelItemsState);

	useEffect(() => {}, []);

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
		<LevelItemFX color={LevelManager.levelData.latestSwappedCandyColor as CandyColor} maskSrc="/img/fx/triangleShape.png"></LevelItemFX>
	) : (
		<img
			data-chocolate
			src={chocolateSprite}
			className="block w-full h-full m-0 select-none pointer-events-none duration-200 animate-[scaleOscillate_0.3s_infinite_alternate]"
			style={{
				transform: `scale(${scale})`,
			}}
		></img>
	);
};

export default Chocolate;
