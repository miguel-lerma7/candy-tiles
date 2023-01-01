export const getNumberRangeArray = (start: number, end: number): number[] =>
	new Array(end - start).fill(0).reduce(prev => [...prev, prev[prev.length - 1] + 1], [start]);

export const getNumberSequenceArray = (start: number, length: number, distance = 1): number[] =>
	new Array(length).fill(0).reduce(prev => [...prev, prev[prev.length - 1] + distance], [start]);

export const getArrayNumberSum = (array: number[]): number => array.reduce((prev, acc) => prev + acc, 0);

export const findAllIndeces = <T>(array: T[], predicate: (item: T, index: number) => boolean): number[] => {
	const indices: number[] = [];
	array.forEach((value, index) => {
		predicate(value, index) && indices.push(index);
	});
	return indices;
};
