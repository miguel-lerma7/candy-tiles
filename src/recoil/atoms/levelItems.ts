import { atom } from 'recoil';

export const levelItemsState = atom({
  key: 'levelItemsState',
  default: [] as LevelItem[]
});
