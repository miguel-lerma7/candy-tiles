import { useEffect, useState } from 'react';
import { checkForAdjacentMatch } from '../../../../../game-algorithms/tile-matching';
import levelManager from '../level-manager';
import { TileProps } from './Tile';
import rockCrack1SFX from './../../../../../assets/audio/rockCrack1.mp3';
import rockCrack2SFX from './../../../../../assets/audio/rockCrack2.mp3';

const rockCrack1Sound = new Audio(rockCrack1SFX);
const rockCrack2Sound = new Audio(rockCrack2SFX);

const RockTile = ({ index }: TileProps) => {
	const [damaged, setDamaged] = useState(false);

	useEffect(() => {
		levelManager.subscribeItemsChange(onItemsChange);
		return () => {
			levelManager.unsubscribeItemsChange(onItemsChange);
		};
	}, [damaged]);

	const onItemsChange = (): void => {
		const matched = checkForAdjacentMatch(index, levelManager.levelData.matchResult.matchingList);
		if (!matched) return;

		if (!damaged) {
			rockCrack1Sound.play();
			setDamaged(true);
			return;
		}

		rockCrack2Sound.play();
		const newTiles = structuredClone(levelManager.levelData.tiles) as LevelTile[];
		newTiles[index] = { type: 'Normal' };
		levelManager.setTiles(newTiles, true);
	};

	return (
		<div className="relative bg-black/25 m-[2%] hover:invert duration-200 select-none rounded cursor-not-allowed" data-index={index}>
			<img src={damaged ? '/img/tiles/rock.png' : '/img/tiles/rock2.png'} className="pointer-events-none"></img>
			<span className="absolute bottom-0 right-0 text-[12px] text-white/50 font-bold hidden">{index}</span>
		</div>
	);
};

export default RockTile;
