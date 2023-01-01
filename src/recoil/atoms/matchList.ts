import { atom } from 'recoil';

export const matchListState = atom({
	key: 'matchList',
	default: [] as MatchDetail[],
});
