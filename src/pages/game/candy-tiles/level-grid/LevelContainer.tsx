import { useMemo, useRef } from 'react';
import { levelList } from '../../../../data/level-layouts';
import uuid from 'react-uuid';
import TileGrid from './TileGrid';
import ItemGrid from './ItemGrid';
import LevelManager from './LevelManager';
import DelayComponent from '../../../../components/DelayComponent';
import { ANIMATION_TIME_MS } from '../../../../config';

const LevelContainer = () => {
	const selectedLevel = levelList[0];
	const levelGridElement = useRef<HTMLElement | null>(null);

	useMemo(() => {
		const initialItems = selectedLevel.items;
		initialItems.forEach(x => x !== null && (x.key = uuid()));
	}, []);

	return (
		<section className='grow aspect-square rounded-lg overflow-hidden relative select-none' ref={levelGridElement}>
			<LevelManager></LevelManager>
			<TileGrid></TileGrid>
			<DelayComponent delayMs={ANIMATION_TIME_MS}>
				<ItemGrid></ItemGrid>
			</DelayComponent>
		</section>
	);
};

export default LevelContainer;
