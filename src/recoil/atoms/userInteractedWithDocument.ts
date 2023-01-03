import { atom } from 'recoil';

export const userInteractedWithDocumentState = atom({
	key: 'userInteractedWithDocument',
	default: false,
});
