import { useContext, createContext, useState, useEffect, useRef } from 'react';
import LevelManager from '../pages/game/candy-tiles/level-grid/level-manager';

type TilePair = [number | null, number | null];

type LevelData = {
	selectedTiles: TilePair;
	updateSelectedTiles: (tilePair: TilePair) => void;
	levelItems: LevelItem[];
	updateLevelItems: (items: LevelItem[]) => void;
};

const LevelContext = createContext<LevelData | null>(null);

type LevelContextProviderProps = {
	children: JSX.Element;
};

const LevelContextProvider = ({ children }: LevelContextProviderProps) => {
	const [selectedTiles, setSelectedTiles] = useState<TilePair>([null, null]);
	const [levelItems, setLevelItems] = useState<LevelItem[]>([]);

	const updateSelectedTiles = (tilePair: TilePair): void => setSelectedTiles(tilePair);
	const updateLevelItems = (items: LevelItem[]): void => setLevelItems(items);

	useEffect(() => {
	}, []);

	const onItemsRerender = (items: LevelItem[]): void => setLevelItems(structuredClone(items));

	const providerValue: LevelData = {
		selectedTiles,
		updateSelectedTiles,
		levelItems,
		updateLevelItems,
	};

	return <LevelContext.Provider value={providerValue}>{children}</LevelContext.Provider>;
};

export const useLevelContext = (): LevelData | null => useContext(LevelContext);

export default LevelContextProvider;
