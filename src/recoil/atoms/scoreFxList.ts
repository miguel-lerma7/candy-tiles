import { atom } from 'recoil';

export const scoreFxListState = atom({
	key: 'scoreFxList',
	default: [] as ScoreFx[],
});
