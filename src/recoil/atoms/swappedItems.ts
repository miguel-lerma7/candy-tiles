import { atom } from 'recoil';

export const swappedItemsState = atom({
	key: 'swappedItems',
	default: [null, null] as SwappedItems,
});
