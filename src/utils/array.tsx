export const getNumberRangeArray = (start: number, end: number): number[] =>
	new Array(end - start).fill(0).reduce(prev => [...prev, prev[prev.length - 1] + 1], [start]);

export const getNumberSequenceArray = (start: number, length: number, distance = 1): number[] =>
	new Array(length).fill(0).reduce(prev => [...prev, prev[prev.length - 1] + distance], [start]);
