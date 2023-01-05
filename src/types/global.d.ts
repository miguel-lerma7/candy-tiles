export {};

declare global {
	type CandyColor = 'Red' | 'Orange' | 'Yellow' | 'Green' | 'Blue' | 'Purple' | 'White';

	type Candy = {
		color: CandyColor;
		type: 'Candy';
		key?: string;
	};

	type SuperCandy = {
		color: CandyColor;
		type: 'SuperCandy';
		key?: string;
	};

	type Chocolate = {
		type: 'Chocolate';
		key?: string;
	};

	type IceCream = {
		type: 'IceCream';
		key?: string;
	};

	type Tile = {
		type: 'Normal' | 'Frozen' | 'Rock';
	};

	type LevelItem = Candy | SuperCandy | Chocolate | IceCream | null;
	type LevelTile = Tile | null;

	type MatchDetail = {
		up: number;
		right: number;
		down: number;
		left: number;
		index: number;
		matched: boolean;
	};

	type MatchGroup = number[];

	type MatchResult = {
		thereWereMatches: boolean;
		matchingList: MatchDetail[];
		matchingGroups: MatchGroup[];
	};

	type LevelRuntimeData = {
		previousItems: string;
		items: LevelItem[];
		tiles: LevelTile[];
		matchResult: MatchResult;
		actionsLocked: boolean;
		comboCount: number;
		swappedItems: [number | null, number | null];
		latestSwappedCandyColor: string;
	};

	type SwappedItems = [number | null, number | null];

	type ScoreFx = {
		position: [number, number];
		color: CandyColor;
		score: number;
		key: string;
	};
}
