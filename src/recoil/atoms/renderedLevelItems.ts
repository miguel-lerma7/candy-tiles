import { atomFamily } from "recoil";

export const renderedLevelItemsState = atomFamily({
  key: "renderedLevelItems",
  default: null as LevelItem
})