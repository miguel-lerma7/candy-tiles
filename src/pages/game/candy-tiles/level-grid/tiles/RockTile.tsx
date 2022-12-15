import { useEffect, useState } from 'react';
import levelManager from '../level-manager';
import { TileProps } from './Tile';

const RockTile = ({ index }: TileProps) => {
	const [damaged, setDamaged] = useState(false);

	useEffect(() => {
		levelManager.subscribeItemsChange(onItemsChange);
		return () => {
			levelManager.unsubscribeItemsChange(onItemsChange);
		};
	}, [damaged]);

	const onItemsChange = (): void => {
    //TODO CHECK ADJACENT MATCHES
    return;
		const matched = levelManager.levelData.matchResult.matchingList.some(x => x.index === index && x.matched);
		matched && !damaged && setDamaged(true);
		console.log(damaged);

		if (matched && damaged) {
			const newTiles = structuredClone(levelManager.levelData.tiles) as LevelTile[];
			newTiles[index] = { type: 'Normal' };
			levelManager.setTiles(newTiles, true);
		}
	};

	return (
		<div className="relative bg-black/25 m-[2%] hover:invert duration-200 select-none rounded cursor-not-allowed" data-index={index}>
			<img src={damaged ? '/img/tiles/rock.png' : '/img/tiles/rock2.png'} className="pointer-events-none"></img>
			<span className="absolute bottom-0 right-0 text-[12px] text-white/50 font-bold hidden">{index}</span>
		</div>
	);
};

export default RockTile;
