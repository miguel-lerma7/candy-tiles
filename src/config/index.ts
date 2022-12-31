export const COLUMN_NUMBER = parseInt(import.meta.env.VITE_COLUMN_NUMBER);
export const ROW_NUMBER = parseInt(import.meta.env.VITE_ROW_NUMBER);
export const TILE_COUNT = COLUMN_NUMBER * ROW_NUMBER;
export const ANIMATION_TIME_MS = parseInt(import.meta.env.VITE_ANIMATION_TIME_MS);
export const ANIMATION_TIME_SECONS = ANIMATION_TIME_MS / 1000;
