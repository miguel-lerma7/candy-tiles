import { useCallback, useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { ANIMATION_TIME_MS } from '../../../../config';
import { levelList } from '../../../../data/level-layouts';
import { allTilesFilled, checkForMatchings, generateNewCandies, repositionItems } from '../../../../game-algorithms/tile-matching';
import { levelItemsState } from '../../../../recoil/atoms/levelItems';
import { levelTilesState } from '../../../../recoil/atoms/levelTiles';
import { swappedItemsState } from '../../../../recoil/atoms/swappedItems';
import matchSFX from './../../../../assets/audio/match.mp3';
import fusionMatchSFX from './../../../../assets/audio/fusionMatch.mp3';
import { delay } from '../../../../utils/delay';
import { flushSync } from 'react-dom';
import { getLevelItemByFusion } from '../../../../game-algorithms/candy-fusions';

const matchSound = new Audio(matchSFX);
const fusionMatchSound = new Audio(fusionMatchSFX);

export let comboCount = 0;

const applyMatches = (matchInfo: MatchResult, itemList: LevelItem[]): LevelItem[] => {
	const newItemList = structuredClone(itemList) as LevelItem[];
	const matchGroupsCenters = matchInfo.matchingGroups.map(x => x[Math.floor(x.length / 2)]);
	matchInfo.matchingList
		.filter(x => x.matched)
		.forEach(y => {
			const itemIsAtMatchGroupCenter = matchGroupsCenters.includes(y.index);
			newItemList[y.index] = itemIsAtMatchGroupCenter ? getLevelItemByFusion(y, newItemList[y.index]) : null;
			const itemWasFused = newItemList[y.index] !== null;
			itemWasFused && fusionMatchSound.play();
		});
	return newItemList;
};

const playMatchSFX = (): void => {
	matchSound.playbackRate = 1 + comboCount / 10;
	matchSound.currentTime = 0;
	matchSound.play();
	matchSound.preservesPitch = false;
};

const LevelManagerC = () => {
	const [swappedItems, setSwappedItems] = useRecoilState(swappedItemsState);
	const [levelItems, setLevelItems] = useRecoilState(levelItemsState);
	const [levelTiles, setLevelTiles] = useRecoilState(levelTilesState);

	const checkingForMatches = useRef(false);

	useEffect(() => {
		setLevelTiles(levelList[0].tiles);
		setLevelItems(levelList[0].items);
	}, []);

	useEffect(() => swapItems(false), [swappedItems]);

	const swapItems = (undo: boolean) => {
		if (swappedItems.some(x => x === null)) return;

		const firstIndex = swappedItems[0] || -1;
		const secondIndex = swappedItems[1] || -1;

		const firstItem = structuredClone(levelItems[firstIndex]) as LevelItem;
		const secondItem = structuredClone(levelItems[secondIndex]) as LevelItem;

		const newLevelItems = structuredClone(levelItems) as LevelItem[];
		newLevelItems[firstIndex] = undo ? firstItem : secondItem;
		newLevelItems[secondIndex] = undo ? secondItem : firstItem;

		if (undo) {
			setTimeout(() => {
				setSwappedItems([null, null]);
				setLevelItems(newLevelItems);
			}, ANIMATION_TIME_MS);
			return;
		}

		setLevelItems(newLevelItems);
		setTimeout(() => checkForMatches(newLevelItems, true), ANIMATION_TIME_MS);
	};

	const checkForMatches = async (itemList: LevelItem[], checkSwap: boolean): Promise<void> => {
		checkingForMatches.current = true;
		const matchInfo = checkForMatchings(itemList);

		if (matchInfo.thereWereMatches || !allTilesFilled(itemList, levelTiles)) {
			setSwappedItems([null, null]);
			playMatchSFX();
			comboCount += 1;
			const matchResult = applyMatches(matchInfo, itemList);
			setLevelItems(matchResult);
			await delay(ANIMATION_TIME_MS);
			const repositionResult = repositionItems(matchResult, levelTiles).repositionedItems;
			const fillResult = generateNewCandies(repositionResult, levelTiles);
			setLevelItems(fillResult);
			await delay(ANIMATION_TIME_MS);
			checkingForMatches.current = false;
			checkForMatches(fillResult, false);
			return;
		}

		const thereAreSwappedItems = swappedItems.every(x => x !== null);
		thereAreSwappedItems && checkSwap && swapItems(true);

		checkingForMatches.current = false;
		comboCount = 0;
	};

	return <></>;
};

export default LevelManagerC;
