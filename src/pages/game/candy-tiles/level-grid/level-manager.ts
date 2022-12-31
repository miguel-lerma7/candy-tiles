import { delay } from '../../../../utils/delay';
import { checkForMatchings, generateNewCandies, repositionItems, allTilesFilled } from '../../../../game-algorithms/tile-matching';
import matchSFX from './../../../../assets/audio/match.mp3';
import fusionMatchSFX from './../../../../assets/audio/fusionMatch.mp3';
import { getLevelItemByFusion } from '../../../../game-algorithms/candy-fusions';
import { ANIMATION_TIME_MS } from '../../../../config';

const DEFAULT_SWAPPED_CANDY_COLOR = 'Red';

class LevelManager {
	private itemsChangeSubscribers: (() => void)[] = [];
	private itemsSwapSubscribers: ((itemsSwapped: [number | null, number | null]) => void)[] = [];
	private comboStartSubscribers: (() => void)[] = [];
	private comboEndStartSubscribers: (() => void)[] = [];
	private itemsRerenderSubscribers: ((items: LevelItem[]) => void)[] = [];
	private tilesChangeSubscribers: (() => void)[] = [];

	private _levelData: LevelRuntimeData = {
		previousItems: '',
		items: [],
		tiles: [],
		matchResult: { matchingList: [], thereWereMatches: false, matchingGroups: [] },
		actionsLocked: false,
		comboCount: 1,
		swappedItems: [null, null],
		latestSwappedCandyColor: DEFAULT_SWAPPED_CANDY_COLOR,
	};

	private matchSound = new Audio(matchSFX);
	private fusionMatchSound = new Audio(fusionMatchSFX);

	get levelData(): Readonly<LevelRuntimeData> {
		return this._levelData;
	}

	constructor() {
		this.matchSound.volume = 0.4;
		this.matchSound.preservesPitch = false;

		//this.subscribeComboStart(this.onComboStart);
		this.subscribeComboEnd(this.onComboEnd);
	}

	subscribeItemsChange = (callback: () => void): void => {
		this.itemsChangeSubscribers.push(callback);
	};
	unsubscribeItemsChange = (callback: () => void): void => {
		this.itemsChangeSubscribers = this.itemsChangeSubscribers.filter(x => x !== callback);
	};
	notifyItemsChange = (): void => {
		this.itemsChangeSubscribers.forEach(callback => callback());
	};

	subscribeItemsSwap = (callback: (itemsSwapped: [number | null, number | null]) => void): void => {
		this.itemsSwapSubscribers.push(callback);
	};
	unsubscribeItemsSwap = (callback: (itemsSwapped: [number | null, number | null]) => void): void => {
		this.itemsSwapSubscribers = this.itemsSwapSubscribers.filter(x => x !== callback);
	};

	notifyItemsSwap = (): void => {
		this.itemsSwapSubscribers.forEach(callback => callback(this._levelData.swappedItems));
	};

	subscribeItemsRerender = (callback: (items: LevelItem[]) => void): void => {
		this.itemsRerenderSubscribers.push(callback);
	};
	unsubscribeItemsRerender = (callback: (items: LevelItem[]) => void): void => {
		this.itemsRerenderSubscribers = this.itemsRerenderSubscribers.filter(x => x !== callback);
	};
	notifyItemsRerender = (): void => {
		this.itemsRerenderSubscribers.forEach(callback => callback(this._levelData.items));
	};

	subscribeComboStart = (callback: () => void): void => {
		this.comboStartSubscribers.push(callback);
	};
	unsubscribeComboStart = (callback: () => void): void => {
		this.comboStartSubscribers = this.comboStartSubscribers.filter(x => x !== callback);
	};
	notifyComboStart = (): void => {
		this.comboStartSubscribers.forEach(callback => callback());
	};

	subscribeComboEnd = (callback: () => void): void => {
		this.comboEndStartSubscribers.push(callback);
	};
	unsubscribeComboEnd = (callback: () => void): void => {
		this.comboEndStartSubscribers = this.comboEndStartSubscribers.filter(x => x !== callback);
	};
	notifyComboEnd = (): void => {
		this.comboEndStartSubscribers.forEach(callback => callback());
	};

	subscribeTilesChange = (callback: () => void): void => {
		this.tilesChangeSubscribers.push(callback);
	};
	unsubscribeTilesChange = (callback: () => void): void => {
		this.tilesChangeSubscribers = this.tilesChangeSubscribers.filter(x => x !== callback);
	};
	notifyTilesChange = (): void => {
		this.tilesChangeSubscribers.forEach(callback => callback());
	};

	setItems = (items: LevelItem[], notify: boolean): void => {
		this._levelData.items = structuredClone(items);
		notify && this.notifyItemsChange();
	};

	setTiles = (tiles: LevelTile[], notify: boolean): void => {
		this._levelData.tiles = tiles;
		notify && this.notifyTilesChange();
	};

	swapItems = async (items: [number, number]): Promise<void> => {
		this._levelData.swappedItems = items;
		this.notifyComboStart();
		this._levelData.latestSwappedCandyColor = this.getLatestSwappedItemColor();
		this.swapSelectedItems();

		this._levelData.matchResult.matchingList = [];
		this.notifyItemsChange();
		this._levelData.previousItems = JSON.stringify(this._levelData.items);

		await delay(ANIMATION_TIME_MS);
		this.notifyItemsSwap();
		await this.checkMatchings();

		const itemsChangedAfterSwap = this._levelData.previousItems !== JSON.stringify(this._levelData.items);
		!itemsChangedAfterSwap && this.undoSwap();
	};

	private swapSelectedItems = (): void => {
		const items = this._levelData.swappedItems as [number, number];
		const firstItem = structuredClone(this._levelData.items[items[0]]);

		this._levelData.items[items[0]] = this._levelData.items[items[1]];
		this._levelData.items[items[1]] = firstItem;
	};

	private undoSwap = (): void => {
		const firstSwap = this._levelData.swappedItems[0];
		const secondSwap = this._levelData.swappedItems[1];

		if (typeof firstSwap !== 'number' || typeof secondSwap !== 'number') return;

		const firstItem = structuredClone(this._levelData.items[firstSwap]);
		this._levelData.items[firstSwap] = structuredClone(this._levelData.items[secondSwap]);
		this._levelData.items[secondSwap] = firstItem;
		this.notifyItemsChange();
	};

	private getLatestSwappedItemColor = (): string => {
		const firstItemColor = (this._levelData.items[this._levelData.swappedItems[0] || 0] as Candy).color;
		const secondItemColor = (this._levelData.items[this._levelData.swappedItems[1] || 0] as Candy).color;
		return firstItemColor || secondItemColor || DEFAULT_SWAPPED_CANDY_COLOR;
	};

	checkMatchings = async (): Promise<void> => {
		this._levelData.matchResult = checkForMatchings(this._levelData.items);
		this.checkSwapFusions();

		if (this._levelData.matchResult.thereWereMatches || !allTilesFilled(this._levelData.items, this._levelData.tiles)) {
			this._levelData.comboCount += 1;
			this.playMatchSFX();
			this.notifyItemsChange();
			this._levelData.matchResult.matchingList = [];
			this._levelData.matchResult.thereWereMatches = false;
			await delay(ANIMATION_TIME_MS);
			this.notifyItemsRerender();
			await delay(ANIMATION_TIME_MS);
			this.updateItemsPositions();
			await delay(ANIMATION_TIME_MS);
			this.fillEmptyTiles();
			return;
		}

		this.notifyComboEnd();
	};

	private checkSwapFusions = (): void => {
		this._levelData.matchResult.matchingList
			.filter(x => x.matched)
			.forEach(match => {
				const itemWasSwapped = this._levelData.swappedItems.includes(match.index);
				const fusionItem = getLevelItemByFusion(match, this._levelData.items[match.index]);
				const canFuse = itemWasSwapped && this._levelData.comboCount === 1;

				this._levelData.items[match.index] = canFuse ? fusionItem : null;
				fusionItem && canFuse && this.fusionMatchSound.play();
			});
	};

	private updateItemsPositions = (): void => {
		const reposition = repositionItems(this._levelData.items, this._levelData.tiles);
		this._levelData.items = reposition.repositionedItems;
		this.notifyItemsChange();
	};

	private fillEmptyTiles = async (): Promise<void> => {
		this._levelData.items = generateNewCandies(this._levelData.items, this._levelData.tiles);
		this.notifyItemsRerender();

		await delay(350);
		this.checkMatchings();
	};

	private playMatchSFX = (): void => {
		this.matchSound.play();
		this.matchSound.playbackRate < 2 && (this.matchSound.playbackRate *= 1.1);
	};

	//private onComboStart = (): void => {};

	private onComboEnd = (): void => {
		this.matchSound.playbackRate = 1;
		this._levelData.comboCount = 1;
	};
}

export default new LevelManager();
