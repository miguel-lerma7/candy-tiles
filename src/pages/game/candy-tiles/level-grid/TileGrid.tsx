import { useEffect, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { COLUMN_NUMBER, ROW_NUMBER } from '../../../../config';
import { useLevelContext } from '../../../../context/LevelContext';
import { tilesAreAdjacent } from '../../../../game-algorithms/tile-matching';
import { allowSwapState } from '../../../../recoil/atoms/allowSwap';
import { levelTilesState } from '../../../../recoil/atoms/levelTiles';
import { swappedItemsState } from '../../../../recoil/atoms/swappedItems';
import tileClickSFX from './../../../../assets/audio/tileClick.mp3';
import FrostTile from './tiles/FrostTile';
import RockTile from './tiles/RockTile';
import Tile from './tiles/Tile';

const elementIsTile = (element: HTMLElement) => element.hasAttribute('data-tile');

const getTileComponent = (tileType: string, index: number): JSX.Element => {
	switch (tileType) {
		case 'Normal':
			return <Tile key={index} index={index}></Tile>;

		case 'Frozen':
			return <FrostTile key={index} index={index}></FrostTile>;

		case 'Rock':
			return <RockTile key={index} index={index}></RockTile>;

		default:
			return <Tile key={index} index={index}></Tile>;
	}
};

const tileClickAudio = new Audio(tileClickSFX);

const TileGrid = () => {
	const levelTiles = useRecoilValue(levelTilesState);
	const dragging = useRef<boolean>(false);
	const levelContext = useLevelContext();
	const firstTile = useRef<HTMLElement | null>();
	const setSwappedItems = useSetRecoilState(swappedItemsState);
	const allowSwap = useRecoilValue(allowSwapState);
	const tileGridElementRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		tileClickAudio.volume = 0.5;
	}, []);

	useEffect(() => {
		updateGridInteraction();
	}, [allowSwap]);

	const updateGridInteraction = () => {
		if (tileGridElementRef.current) tileGridElementRef.current.style.pointerEvents = allowSwap ? 'all' : 'none';
	};

	const handleMouseDown = (e: React.MouseEvent): void => {
		if (!elementIsTile(e.target as HTMLElement)) return;
		dragging.current = true;
		firstTile.current = e.target as HTMLElement;
		tileClickAudio.play();
	};

	const handleMouseUp = (): void => {
		firstTile.current = null;
		dragging.current = false;
	};

	const handleMouseOver = (e: React.MouseEvent): void => {
		if (!elementIsTile(e.target as HTMLElement) || !firstTile.current || !dragging.current || !allowSwap) return;

		const firstTileIndex = parseInt(firstTile.current.getAttribute('data-index') || '');
		const secondTileIndex = parseInt((e.target as HTMLElement).getAttribute('data-index') || '');

		if (!tilesAreAdjacent(firstTileIndex, secondTileIndex)) {
			levelContext?.updateSelectedTiles([null, null]);
			setSwappedItems([null, null]);
			return;
		}

		setSwappedItems([firstTileIndex, secondTileIndex]);
		firstTile.current = null;
	};

	return (
		<div
			className='grid absolute top-0 left-0 w-full h-full'
			style={{ gridTemplateColumns: `repeat(${COLUMN_NUMBER}, 1fr)`, gridTemplateRows: `repeat(${ROW_NUMBER}, 1fr)` }}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onMouseOver={handleMouseOver}
			ref={tileGridElementRef}
		>
			{levelTiles.map((tile, index) => (tile === null ? <div key={index}> </div> : getTileComponent(tile.type, index)))}
		</div>
	);
};

export default TileGrid;
