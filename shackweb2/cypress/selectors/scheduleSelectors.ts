import { searchById, searchContainsId } from "../support/utils";

export const selectors = {
  shackScheduleHeading: searchById("shackScheduleHeading"),
  shackScheduleItem: searchContainsId("shackScheduleItem"),
  startTimeInput: searchContainsId("startTimeInput"),
  durationInput: searchContainsId("durationInput"),
  saveButton: searchContainsId("saveButton"),
  plusButton: searchContainsId("plusButton"),
  trashButton: searchContainsId("trashButton"),
  addNewItemButton: searchContainsId("AddNewItemButton"),
};
