import { useEffect, useRef } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { ANIMATION_TIME_MS } from '../../../../config';
import { levelList } from '../../../../data/level-layouts';
import {
	allTilesFilled,
	checkForMatchings,
	generateNewCandies,
	getHorizontalAndVerticalItems,
	getMatchGroupCenterIndex,
	repositionItems,
} from '../../../../game-algorithms/tile-matching';
import { levelItemsState } from '../../../../recoil/atoms/levelItems';
import { levelTilesState } from '../../../../recoil/atoms/levelTiles';
import { swappedItemsState } from '../../../../recoil/atoms/swappedItems';
import matchSFX from './../../../../assets/audio/match.mp3';
import fusionMatchSFX from './../../../../assets/audio/fusionMatch.mp3';
import { delay } from '../../../../utils/delay';
import { getLevelItemByFusion } from '../../../../game-algorithms/candy-fusions';
import { allowSwapState } from '../../../../recoil/atoms/allowSwap';
import { matchListState } from '../../../../recoil/atoms/matchList';
import uuid from 'react-uuid';

const matchSound = new Audio(matchSFX);
const fusionMatchSound = new Audio(fusionMatchSFX);

export let comboCount = 0;
const DEFAULT_SWAPPED_CANDY_COLOR: CandyColor = 'Red';
export let latestSwappedCandyColor: CandyColor = DEFAULT_SWAPPED_CANDY_COLOR;

const playFusionMatch = () => {
	fusionMatchSound.currentTime = 0;
	fusionMatchSound.play();
};

const applyMatches = (matchInfo: MatchResult, itemList: LevelItem[]): LevelItem[] => {
	const newItemList = structuredClone(itemList) as LevelItem[];
	matchInfo.matchingList = applySuperCandyEffects(matchInfo.matchingList, newItemList);

	const matchGroupsCenters = matchInfo.matchingGroups.map(group => getMatchGroupCenterIndex(group, matchInfo.matchingList));
	matchInfo.matchingList
		.filter(x => x.matched)
		.forEach(y => {
			const itemIsAtMatchGroupCenter = matchGroupsCenters.includes(y.index);
			newItemList[y.index] = itemIsAtMatchGroupCenter ? getLevelItemByFusion(y, newItemList[y.index]) : null;
			const itemWasFused = newItemList[y.index] !== null;
			itemWasFused && playFusionMatch();
		});

	return newItemList;
};

const applySuperCandyEffects = (matchList: MatchDetail[], itemList: LevelItem[]): MatchDetail[] => {
	let newMatchList = structuredClone(matchList) as MatchDetail[];
	const matchedItems = matchList.filter(x => x.matched);
	const matchedSuperCandies = itemList.filter((x, i) => x?.type === 'SuperCandy' && matchedItems.some(y => y.index === i));

	const superCandiesUsed: number[] = [];

	const getAllIntersectingCandies = (matchedSuperCandy: LevelItem) => {
		const matchedSuperCandyIndex = itemList.findIndex(y => y?.key === matchedSuperCandy?.key);
		superCandiesUsed.push(matchedSuperCandyIndex);
		const intersectingItems = getHorizontalAndVerticalItems(matchedSuperCandyIndex);

		newMatchList = newMatchList.map(matchDetail => {
			intersectingItems.includes(matchDetail.index) && (matchDetail.matched = true);
			return matchDetail;
		});

		intersectingItems
			.filter(x => itemList[x]?.type === 'SuperCandy' && !superCandiesUsed.includes(x))
			.forEach(x => getAllIntersectingCandies(itemList[x]));
	};

	matchedSuperCandies.forEach(x => getAllIntersectingCandies(x));

	return newMatchList;
};

const getInitialItems = (selectedLevel: number): LevelItem[] => {
	levelList[selectedLevel].items.forEach(x => x !== null && x.key === uuid());
	return levelList[0].items.map(x => {
		x !== null && (x.key = uuid());
		return x;
	});
};

const playMatchSFX = (): void => {
	matchSound.playbackRate = 1 + comboCount / 10;
	matchSound.currentTime = 0;
	matchSound.play();
	matchSound.preservesPitch = false;
};

const LevelManager = () => {
	const [swappedItems, setSwappedItems] = useRecoilState(swappedItemsState);
	const [levelItems, setLevelItems] = useRecoilState(levelItemsState);
	const [levelTiles, setLevelTiles] = useRecoilState(levelTilesState);
	const setAllowSwap = useSetRecoilState(allowSwapState);
	const setMatchList = useSetRecoilState(matchListState);

	const itemsWereSwapped = useRef(false);

	useEffect(() => {
		const initialItems = getInitialItems(0);
		setLevelTiles(levelList[0].tiles);
		setLevelItems(initialItems);
	}, []);

	useEffect(() => swapItems(false), [swappedItems]);

	const swapItems = (undo: boolean) => {
		if (swappedItems.some(x => x === null)) return;
		itemsWereSwapped.current = true;

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
				itemsWereSwapped.current = false;
				setLevelItems(newLevelItems);
			}, ANIMATION_TIME_MS);
			return;
		}

		setLevelItems(newLevelItems);
		setAllowSwap(false);
		setTimeout(() => checkForMatches(newLevelItems, true), ANIMATION_TIME_MS);
	};

	const checkForMatches = async (itemList: LevelItem[], checkSwap: boolean): Promise<void> => {
		let matchInfo = checkForMatchings(itemList);
		matchInfo = checkChocolateSwap(matchInfo, itemList);

		if (matchInfo.thereWereMatches || !allTilesFilled(itemList, levelTiles)) {
			setSwappedItems([null, null]);
			itemsWereSwapped.current = false;
			playMatchSFX();
			comboCount += 1;
			const matchResult = applyMatches(matchInfo, itemList);
			setLevelItems(matchResult);
			setMatchList(matchInfo.matchingList);
			await delay(ANIMATION_TIME_MS);
			const repositionResult = repositionItems(matchResult, levelTiles).repositionedItems;
			const fillResult = generateNewCandies(repositionResult, levelTiles);
			setLevelItems(fillResult);
			await delay(ANIMATION_TIME_MS);
			checkForMatches(fillResult, false);
			return;
		}

		const thereAreSwappedItems = swappedItems.every(x => x !== null);
		thereAreSwappedItems && checkSwap && swapItems(true);

		comboCount = 0;
		setAllowSwap(true);
	};

	const checkChocolateSwap = (matchInfo: MatchResult, itemList: LevelItem[]): MatchResult => {
		const swappedChocolateIndex = itemList.findIndex((x, i) => swappedItems.includes(i) && x?.type === 'Chocolate');
		const otherItemSwapIndex = swappedItems.find(x => x !== swappedChocolateIndex);
		const otherItem = itemList.find((x, i) => i === otherItemSwapIndex);

		if (swappedChocolateIndex < 0 || !itemsWereSwapped.current || otherItem?.type === 'Chocolate') return matchInfo;

		const otherItemIndex = swappedItems.find(x => x !== swappedChocolateIndex);
		const otherItemColor: CandyColor = (levelItems[swappedChocolateIndex] as Candy).color || DEFAULT_SWAPPED_CANDY_COLOR;
		latestSwappedCandyColor = otherItemColor;

		matchInfo.matchingList = matchInfo.matchingList.map(matchDetail => {
			(levelItems[matchDetail.index] as Candy).color === otherItemColor && (matchDetail.matched = true);
			return matchDetail;
		});

		const matchProps = { down: 0, left: 0, right: 0, up: 0 };
		matchInfo.matchingList.push({ index: swappedChocolateIndex, matched: true, ...matchProps });
		typeof otherItemIndex === 'number' && matchInfo.matchingList.push({ index: otherItemIndex, matched: true, ...matchProps });

		matchInfo.thereWereMatches = matchInfo.matchingList.some(x => x.matched);

		return matchInfo;
	};

	return <></>;
};

export default LevelManager;
