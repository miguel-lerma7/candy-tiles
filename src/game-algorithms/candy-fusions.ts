import uuid from "react-uuid";

export const tryGetLevelItemByFusion = (matchDetail: MatchDetail, previousItem: LevelItem): LevelItem => {
  let item: LevelItem = null;

  const previousItemWasACandy = previousItem?.type === "Candy" || previousItem?.type === "SuperCandy";
  if (!previousItemWasACandy) return null;

  const superCandyFusion = (matchDetail.left + matchDetail.right) > 2 || (matchDetail.down + matchDetail.up) > 2;
  const chocolateFusion = [matchDetail.up, matchDetail.left, matchDetail.right, matchDetail.down].filter(x => x > 1).reduce((acc, curr) => acc + curr, 0) > 3;

  if (superCandyFusion) {
    item = {
      color: previousItem?.color,
      type: "SuperCandy",
      key: uuid()
    } as SuperCandy;
  }

  if (chocolateFusion) {
    item = {
      type: "Chocolate",
      key: uuid()
    } as Chocolate;
  }

  return item;
}