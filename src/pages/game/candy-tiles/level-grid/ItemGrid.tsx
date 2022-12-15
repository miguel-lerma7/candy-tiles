import uuid from 'react-uuid';
import { useLevelContext } from '../../../../context/LevelContext';
import { levelList } from '../../../../data/level-layouts';
import LevelItem from './LevelItem';

const ItemGrid = () => {
	const tilesLayout = levelList[0].tiles;
	const levelContext = useLevelContext();

	return (
		<div className="absolute top-0 left-0 w-full h-full pointer-events-none">
			{levelContext?.levelItems.map((item, index) => {
				return tilesLayout[index] === null ? (
					<div key={index}></div>
				) : (
					<LevelItem key={(item as LevelItem)?.key || uuid()} item={item} initialIndex={index} id={item?.key || ''}></LevelItem>
				);
			})}
		</div>
	);
};

export default ItemGrid;
