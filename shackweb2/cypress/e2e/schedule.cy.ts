import {
  searchById,
  searchContainsId,
  waitForPageLoad,
} from "../support/utils";

let url: string = "localhost:3000";
console.log(url);
let shackScheduleHeading = searchById("shackScheduleHeading");
let shackScheduleItem = searchContainsId("shackScheduleItem");

describe("template spec", () => {
  it("passes", () => {
    cy.visit(url);
    waitForPageLoad();
    cy.get(shackScheduleHeading).contains("Shack Schedule");
    cy.get(shackScheduleItem).contains("start time: 2 duration: 5");
    cy.get(shackScheduleItem).contains("start time: 6 duration: 5");
    cy.get(shackScheduleItem).contains("start time: 18 duration: 5");
    cy.get(shackScheduleItem).contains("start time: 22 duration: 5");
  });
});
