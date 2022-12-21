import { useEffect, useMemo, useRef } from 'react';
import { levelList } from '../../../../data/level-layouts';
import { useLevelContext } from '../../../../context/LevelContext';
import LevelManager from './level-manager';
import uuid from 'react-uuid';
import TileGrid from './TileGrid';
import ItemGrid from './ItemGrid';
import LevelManagerC from './LevelManagerC';

const LevelContainer = () => {
	const selectedLevel = levelList[0];
	const levelContext = useLevelContext();
	const levelGridElement = useRef<HTMLElement | null>(null);

	useMemo(() => {
		const initialItems = selectedLevel.items;
		initialItems.forEach(x => x !== null && (x.key = uuid()));
    
		const initialTiles = selectedLevel.tiles;
		LevelManager.setItems(initialItems, false);
		LevelManager.setTiles(initialTiles, false);
	}, []);
  
	useEffect(() => {
    //levelContext?.updateLevelItems(initialItems);
		LevelManager.subscribeComboStart(onComboStart);
		LevelManager.subscribeComboEnd(onComboEnd);

		return () => {
			LevelManager.unsubscribeComboStart(onComboStart);
			LevelManager.unsubscribeComboEnd(onComboEnd);
		};
	}, []);

	const onComboStart = (): void => {
		if (levelGridElement.current) levelGridElement.current.style.pointerEvents = 'none';
	};
	const onComboEnd = (): void => {
		if (levelGridElement.current) levelGridElement.current.style.pointerEvents = 'all';
	};

	return (
		<section className="grow aspect-square rounded-lg overflow-hidden relative select-none" ref={levelGridElement}>
      <LevelManagerC></LevelManagerC>
			<TileGrid></TileGrid>
			<ItemGrid></ItemGrid>
		</section>
	);
};

export default LevelContainer;
