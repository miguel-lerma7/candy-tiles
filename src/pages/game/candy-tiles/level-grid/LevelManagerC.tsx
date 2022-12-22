import { useEffect, useMemo, useRef } from 'react';
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
	matchSound.playbackRate < 2 && (matchSound.playbackRate *= 1.1);
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
		setLevelItems(levelList[0].items);
		setLevelTiles(levelList[0].tiles);
	}, []);

	useEffect(() => swapItems(false), [swappedItems]);
	useEffect(() => {
		if (checkingForMatches.current) return;

		setTimeout(() => {
			checkForMatches();
		}, ANIMATION_TIME_MS);
	}, [levelItems]);

	const swapItems = (undo: boolean) => {
		if (swappedItems.some(x => x === null)) return;

		const firstIndex = swappedItems[0] || -1;
		const secondIndex = swappedItems[1] || -1;

		const firstItem = structuredClone(levelItems[firstIndex]) as LevelItem;
		const secondItem = structuredClone(levelItems[secondIndex]) as LevelItem;

		const newLevelItems = structuredClone(levelItems) as LevelItem[];
		newLevelItems[firstIndex] = secondItem;
		newLevelItems[secondIndex] = firstItem;

		undo
			? setTimeout(() => {
					setSwappedItems([null, null]);
					setLevelItems(newLevelItems);
			  }, ANIMATION_TIME_MS)
			: setLevelItems(newLevelItems);
	};

	const checkForMatches = async () => {
		checkingForMatches.current = true;
		const matchResult = checkForMatchings(levelItems);

		if (matchResult.thereWereMatches || !allTilesFilled(levelItems, levelTiles)) {
			//this._levelData.comboCount += 1;
			const newLevelItems = applyMatches(levelItems, matchResult.matchingList);
			setLevelItems(newLevelItems);
			playMatchSFX();
			//this._levelData.matchResult.matchingList = [];
			//this._levelData.matchResult.thereWereMatches = false;
			await delay(ANIMATION_TIME_MS);
			newLevelItems.forEach((x, index) => updateRenderedLevelItem(index, x)); //NOTIFY RERENDER

			await delay(ANIMATION_TIME_MS);
			const repositionedItems = repositionItems(newLevelItems, levelTiles).repositionedItems;
			setLevelItems(repositionedItems);

			await delay(ANIMATION_TIME_MS);
			//fillEmtyTiles
			const newerLevelItems = generateNewCandies(repositionedItems, levelTiles);
			setLevelItems(generateNewCandies(levelItems, levelTiles));
			newerLevelItems.forEach((x, index) => updateRenderedLevelItem(index, x)); //NOTIFY RERENDER

			await delay(ANIMATION_TIME_MS);
			//checkForMatches();

			return;
		}

		const thereAreSwappedItems = swappedItems.every(x => x !== null);
		thereAreSwappedItems && swapItems(true);

		checkingForMatches.current = false;
	};

	return <></>;
};

export default LevelManagerC;
