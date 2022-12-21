import { TILE_COUNT } from '../../../../config';
import { levelList } from '../../../../data/level-layouts';
import LevelItem from './LevelItem';

const ItemGrid = () => {
	const tilesLayout = levelList[0].tiles;

	return (
		<div className="absolute top-0 left-0 w-full h-full pointer-events-none">
			{Array(TILE_COUNT)
				.fill('')
				.map((x, index) => {
					return tilesLayout[index] === null ? <div key={index}></div> : <LevelItem key={index} initialIndex={index}></LevelItem>;
				})}
		</div>
	);
};

export default ItemGrid;
