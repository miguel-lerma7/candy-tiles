import { atom } from 'recoil';

export const scoreState = atom({
	key: 'score',
	default: 0,
});
