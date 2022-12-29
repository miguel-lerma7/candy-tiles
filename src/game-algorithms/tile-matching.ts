import uuid from "react-uuid";
import { COLUMN_NUMBER, ROW_NUMBER } from "../config";
import { getNumberRangeArray, getNumberSequenceArray } from "../utils/array";
export const CANDY_COLOR_LIST: string[] = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple'];

export const getItemRowIndex = (index: number): number => Math.ceil((index + 1) / COLUMN_NUMBER);
export const getItemColumnIndex = (index: number): number => (index + 1) - ((getItemRowIndex(index) - 1) * ROW_NUMBER);

const getAdjacentIndexes = (index: number): number[] => {
  const verticalAdjacentIndexOffsets = [index - COLUMN_NUMBER, index + COLUMN_NUMBER];
  const horizontalAdjacentIndexOffsets = [index + 1, index - 1];

  return [...verticalAdjacentIndexOffsets.filter(x => getItemColumnIndex(x) === getItemColumnIndex(index)),
  ...horizontalAdjacentIndexOffsets.filter(x => getItemRowIndex(x) === getItemRowIndex(index))]
};

export const tilesAreAdjacent = (firstIndex: number, secondIndex: number): boolean => {
  const areAdjacent = getAdjacentIndexes(firstIndex).some(x => x === secondIndex);
  return areAdjacent;
};

type TileMovePosition = [number, number];

export const getTileTargetPosition = (index: number, tileTargetIndex: number): TileMovePosition => {
  const top = tileTargetIndex === index - ROW_NUMBER ? -100 : tileTargetIndex === index + ROW_NUMBER ? 100 : 0;
  const left = tileTargetIndex === index - 1 ? -100 : tileTargetIndex === index + 1 ? 100 : 0;
  return [top, left];
};

type CandyInLevel = { index: number } & Candy;

const getCandyMatchings = (candy: CandyInLevel, items: readonly LevelItem[]): MatchDetail => {
  const rowIndex = getItemRowIndex(candy.index);
  const columnIndex = getItemColumnIndex(candy.index);

  const leftIterations = columnIndex - 1;
  const upIterations = rowIndex - 1;
  const rightIterations = COLUMN_NUMBER - columnIndex;
  const downIterations = ROW_NUMBER - rowIndex;

  const matchings = {
    "up": { count: 0, iterations: upIterations, getAdjacent: (cycle: number) => candy.index - (COLUMN_NUMBER * cycle) },
    "right": { count: 0, iterations: rightIterations, getAdjacent: (cycle: number) => candy.index + cycle },
    "down": { count: 0, iterations: downIterations, getAdjacent: (cycle: number) => candy.index + (COLUMN_NUMBER * cycle) },
    "left": { count: 0, iterations: leftIterations, getAdjacent: (cycle: number) => candy.index - cycle },
  };

  Object.values(matchings).forEach(direction => {
    for (let i = 1; i < direction.iterations + 1; i++) {
      const adjacentCandy = items[direction.getAdjacent(i)] || null;
      if ((adjacentCandy as Candy)?.color !== candy.color) break;
      direction.count += 1;
    }
  });

  const up = matchings.up.count;
  const right = matchings.right.count;
  const down = matchings.down.count;
  const left = matchings.left.count;
  const matched = (up > 0 && down > 0) || (left > 0 && right > 0) || [up, down, left, right].some(x => x > 1);


  return { up, right, down, left, matched, index: candy.index };
};

const candyTypesArray = ["Candy", "SuperCandy"];

const getMatchGroups = (matchList: MatchDetail[], itemsList: readonly LevelItem[]): MatchGroup[] => {
  const matchedCandyList = matchList.filter(x => x.matched && candyTypesArray.includes(itemsList[x.index]?.type || ""));
  const groups = matchedCandyList.reduce((prev, curr) => {
    if (prev.length === 0) {
      prev.push([curr.index]);
      return prev;
    }

    const candyColor = (itemsList[curr.index] as Candy).color;
    const sameColor = (other: number): boolean => (itemsList[other] as Candy).color === candyColor;
    const group = prev.findIndex(x => x.some(y => tilesAreAdjacent(curr.index, y) && sameColor(y)));
    const validGroup = group >= 0;
    validGroup ? prev[group].push(curr.index) : prev.push([curr.index]);
    return prev;
  }, [] as MatchGroup[]) as MatchGroup[];

  return groups;
};

export const checkForMatchings = (items: readonly LevelItem[]): MatchResult => {
  const candies = [...structuredClone(items)].map((x, index) => ({ ...x, index })).filter(x => candyTypesArray.includes((x as LevelItem)?.type || "")) as CandyInLevel[];
  const matchingList: MatchDetail[] = [];
  candies.forEach(candy => matchingList.push(getCandyMatchings(candy, items)));
  const matchingGroups = getMatchGroups(matchingList, items);

  return {
    thereWereMatches: matchingList.some(x => x.matched),
    matchingList,
    matchingGroups
  };
};

type ItemAbove = {
  index: number | null,
  tileDistanceCount: number
}

const getItemAbove = (itemIdex: number, items: readonly LevelItem[], tiles: readonly LevelTile[]): ItemAbove => {
  let nextItemIndex = itemIdex - COLUMN_NUMBER;
  let tileDistanceCount = 1;
  let aboveItem: number | null = null;

  while (nextItemIndex > -1) {
    const tileAvaliable = tiles[nextItemIndex] !== null;
    const itemEmtpy = items[nextItemIndex] === null;

    if (!tileAvaliable || itemEmtpy) {
      nextItemIndex -= COLUMN_NUMBER;
      tileDistanceCount += 1;
      continue;
    }

    aboveItem = nextItemIndex;
    break;
  };

  return {
    index: aboveItem,
    tileDistanceCount
  };
};

export type NewItemPosition = { index: number, tilesToMove: number };
type RepositionResult = {
  repositionedItems: LevelItem[],
  newPositions: NewItemPosition[]
};

export const repositionItems = (items: readonly LevelItem[], tiles: readonly LevelTile[]): RepositionResult => {
  const repositionedItems = structuredClone(items) as LevelItem[];
  const newPositions: NewItemPosition[] = []

  for (let i = repositionedItems.length - 1; i > 0; i--) {
    const tileAvaliable = tiles[i] !== null;
    if (!tileAvaliable) continue;
    const item = repositionedItems[i];

    if (item === null) {
      const itemAbove = getItemAbove(i, repositionedItems, tiles);
      if (itemAbove.index !== null) {
        repositionedItems[i] = structuredClone(repositionedItems[itemAbove.index]);
        repositionedItems[itemAbove.index] = null;
        newPositions.push({ index: itemAbove.index, tilesToMove: itemAbove.tileDistanceCount })
      }
    }
  }

  return {
    repositionedItems,
    newPositions
  }
};

const getRandomColorCandy = (): LevelItem => {
  return {
    color: CANDY_COLOR_LIST[Math.floor(Math.random() * CANDY_COLOR_LIST.length)],
    type: "Candy",
    key: uuid()
  } as Candy;
};

export const generateNewCandies = (items: readonly LevelItem[], tiles: readonly LevelTile[]): LevelItem[] => {
  const newCandies = structuredClone(items) as LevelItem[];
  newCandies.forEach((item, index) => {
    const tileAvaliable = tiles[index] !== null;
    if (item === null && tileAvaliable) newCandies[index] = getRandomColorCandy()
  });

  return newCandies;
};

export const getHorizontalAndVerticalItems = (startIndex: number): number[] => {
  const rowIndex = Math.ceil((startIndex + 1) / ROW_NUMBER);
  const columnIndex = (startIndex + 1) - ((rowIndex - 1) * ROW_NUMBER);

  const horizontalRangeStart = ((rowIndex - 1) * COLUMN_NUMBER);
  const horizontalRangeEnd = horizontalRangeStart + (COLUMN_NUMBER - 1);

  const horizontalItems = getNumberRangeArray(horizontalRangeStart, horizontalRangeEnd);
  const verticalItems = getNumberSequenceArray(columnIndex - 1, ROW_NUMBER - 1, COLUMN_NUMBER);

  return [...horizontalItems, ...verticalItems];
};

export const allTilesFilled = (items: readonly LevelItem[], tiles: readonly LevelTile[]): boolean => {
  return !(structuredClone(items) as LevelItem[]).some((x, index) => tiles[index] !== null && x === null);
};

export const checkForAdjacentMatch = (index: number, matchList: readonly MatchDetail[]): boolean => {
  const adjacentIndexes = getAdjacentIndexes(index);
  return matchList.filter(x => adjacentIndexes.includes(x.index)).some(y => y.matched);
}

