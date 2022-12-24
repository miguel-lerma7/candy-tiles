import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import { ANIMATION_TIME_MS } from '../../../../config';
import { levelList } from '../../../../data/level-layouts';
import { allTilesFilled, checkForMatchings, generateNewCandies, repositionItems } from '../../../../game-algorithms/tile-matching';
import { levelItemsState } from '../../../../recoil/atoms/levelItems';
import { levelTilesState } from '../../../../recoil/atoms/levelTiles';
import { swappedItemsState } from '../../../../recoil/atoms/swappedItems';
import matchSFX from './../../../../assets/audio/match.mp3';
import fusionMatchSFX from './../../../../assets/audio/fusionMatch.mp3';
import { renderedLevelItemsState } from '../../../../recoil/atoms/renderedLevelItems';
import { delay } from '../../../../utils/delay';

const matchSound = new Audio(matchSFX);
const fusionMatchSound = new Audio(fusionMatchSFX);

const playMatchSFX = (combo?: number): void => {
	matchSound.play();
	//matchSound.playbackRate < 2 && (matchSound.playbackRate *= 1.1);
};

const applyMatches = (levelItems: readonly LevelItem[], matchList: readonly MatchDetail[]): LevelItem[] => {
	const newLevelItems = structuredClone(levelItems) as LevelItem[];
	matchList
		.filter(x => x.matched)
		.forEach(match => {
			//TODO: CHECK FOR FUSION
			newLevelItems[match.index] = null;
			//IF FUSION => fusionMatchSound.play();
		});
	return newLevelItems;
};

const LevelManagerC = () => {
	const [swappedItems, setSwappedItems] = useRecoilState(swappedItemsState);
	const [levelItems, setLevelItems] = useRecoilState(levelItemsState);
	const [levelTiles, setLevelTiles] = useRecoilState(levelTilesState);
	const updateRenderedLevelItem = useRecoilCallback(({ set }) => (levelItemIndex: number, newLevelItem: LevelItem) => {
		set(renderedLevelItemsState(levelItemIndex), newLevelItem);
	});

	const checkingForMatches = useRef(false);

	useEffect(() => {
		setLevelTiles(levelList[0].tiles);
		setLevelItems(levelList[0].items);
		levelList[0].items.forEach((x, index) => updateRenderedLevelItem(index, x));
	}, []);

	useEffect(() => swapItems(false), [swappedItems]);
	/* useEffect(() => {
		if (checkingForMatches.current) return;

		setTimeout(() => {
			checkForMatches();
		}, ANIMATION_TIME_MS);
	}, [levelItems]); */

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
				console.log(newLevelItems);

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
			//this._levelData.comboCount += 1;
			const matchResult = applyMatches(itemList, matchInfo.matchingList);
			setLevelItems(matchResult);
			playMatchSFX();
			await delay(ANIMATION_TIME_MS);
			const repositionResult = repositionItems(matchResult, levelTiles).repositionedItems;
			setLevelItems(repositionResult);
			await delay(ANIMATION_TIME_MS);
			repositionResult.forEach((x, index) => updateRenderedLevelItem(index, x));
			await delay(ANIMATION_TIME_MS);
			const fillResult = generateNewCandies(repositionResult, levelTiles);
			setLevelItems(fillResult);
			fillResult.forEach((x, index) => updateRenderedLevelItem(index, x)); //NOTIFY RERENDER
			await delay(ANIMATION_TIME_MS);
			checkingForMatches.current = false;
			checkForMatches(fillResult, false);
			return;
		}

		const thereAreSwappedItems = swappedItems.every(x => x !== null);
		thereAreSwappedItems && checkSwap && swapItems(true);

		checkingForMatches.current = false;
	};

	return <></>;
};

export default LevelManagerC;
