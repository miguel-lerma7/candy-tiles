import { useEffect, useState } from 'react';
import levelManager from '../level-manager';
import { TileProps } from './Tile';
import iceCrack1SFX from './../../../../../assets/audio/iceCrack1.mp3';
import iceCrack2SFX from './../../../../../assets/audio/iceCrack2.mp3';

const iceCrack1Sound = new Audio(iceCrack1SFX);
const iceCrack2Sound = new Audio(iceCrack2SFX);

const FrostTile = ({ index }: TileProps) => {
	const [damaged, setDamaged] = useState(false);

	useEffect(() => {
		levelManager.subscribeItemsChange(onItemsChange);
		return () => {
			levelManager.unsubscribeItemsChange(onItemsChange);
		};
	}, [damaged]);

	const onItemsChange = (): void => {
		const matched = levelManager.levelData.matchResult.matchingList.some(x => x.index === index && x.matched);
		if (!matched) return;

		if (!damaged) {
			iceCrack1Sound.play();
			setDamaged(true);
			return;
		}

		iceCrack2Sound.play();
		const newTiles = structuredClone(levelManager.levelData.tiles) as LevelTile[];
		newTiles[index] = { type: 'Normal' };
		levelManager.setTiles(newTiles, true);
	};

	return (
		<div className="relative bg-black/25 m-[2%] hover:invert duration-200 select-none rounded" data-index={index} data-tile>
			<img src={damaged ? '/img/tiles/frost.png' : '/img/tiles/frost2.png'} className="pointer-events-none"></img>
			<span className="absolute bottom-0 right-0 text-[12px] text-black font-bold">{index}</span>
		</div>
	);
};

export default FrostTile;
