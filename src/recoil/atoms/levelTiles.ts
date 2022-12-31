import { atom } from 'recoil';

export const levelTilesState = atom({
	key: 'levelTiles',
	default: [] as LevelTile[],
});
