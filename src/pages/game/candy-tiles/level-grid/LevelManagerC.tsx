import { useEffect, useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ANIMATION_TIME_MS } from '../../../../config';
import { levelList } from '../../../../data/level-layouts';
import { allTilesFilled, checkForMatchings } from '../../../../game-algorithms/tile-matching';
import { levelItemsState } from '../../../../recoil/atoms/levelItems';
import { levelTilesState } from '../../../../recoil/atoms/levelTiles';
import { swappedItemsState } from '../../../../recoil/atoms/swappedItems';
import matchSFX from './../../../../assets/audio/match.mp3';
import fusionMatchSFX from './../../../../assets/audio/fusionMatch.mp3';

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

	useEffect(() => {
		setLevelItems(levelList[0].items);
		setLevelTiles(levelList[0].tiles);
	}, []);

	useEffect(() => swapItems(false), [swappedItems]);
	useEffect(() => {
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

	const checkForMatches = () => {
		const matchResult = checkForMatchings(levelItems);
		console.log(matchResult);

		if (matchResult.thereWereMatches || !allTilesFilled(levelItems, levelTiles)) {
			//this._levelData.comboCount += 1;
			playMatchSFX();
			//this.notifyItemsChange();
			setLevelItems(applyMatches(levelItems, matchResult.matchingList));
			//this._levelData.matchResult.matchingList = [];
			//this._levelData.matchResult.thereWereMatches = false;
			setTimeout(() => {
				//this.notifyItemsRerender();
			}, ANIMATION_TIME_MS);
			setTimeout(() => {
				//this.updateItemsPositions();
			}, ANIMATION_TIME_MS * 2);
			setTimeout(() => {
				//this.fillEmptyTiles();
			}, ANIMATION_TIME_MS * 3);
			return;
		}

		const thereAreSwappedItems = swappedItems.every(x => x !== null);
		thereAreSwappedItems && swapItems(true);
	};

	return <></>;
};

export default LevelManagerC;
