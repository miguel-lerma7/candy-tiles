import { atom } from 'recoil';

type LevelMoves = {
	total: number;
	done: number;
	spendAllMoves: boolean
};

export const levelMovesState = atom({
	key: 'leftMoves',
	default: {
		total: 0,
		done: 0,
	} as LevelMoves,
});
