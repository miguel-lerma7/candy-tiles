import { useEffect, useMemo, useRef } from 'react';
import { levelList } from '../../../../data/level-layouts';
import { useLevelContext } from '../../../../context/LevelContext';
import LevelManager from './level-manager';
import uuid from 'react-uuid';
import TileGrid from './TileGrid';
import ItemGrid from './ItemGrid';
import LevelManagerC from './LevelManagerC';
import DelayComponent from '../../../../components/DelayComponent';
import { ANIMATION_TIME_MS } from '../../../../config';

const LevelContainer = () => {
	const selectedLevel = levelList[0];
	const levelContext = useLevelContext();
	const levelGridElement = useRef<HTMLElement | null>(null);

	useMemo(() => {
		const initialItems = selectedLevel.items;
		initialItems.forEach(x => x !== null && (x.key = uuid()));

		const initialTiles = selectedLevel.tiles;
		LevelManager.setTiles(initialTiles, false);
		LevelManager.setItems(initialItems, false);
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
			<DelayComponent delayMs={ANIMATION_TIME_MS}>
				<ItemGrid></ItemGrid>
			</DelayComponent>
		</section>
	);
};

export default LevelContainer;
