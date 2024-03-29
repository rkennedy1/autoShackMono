import { waitForPageLoad, webURL, apiURL } from "../support/utils";
import ScheduleItems from "../fixtures/scheduleItems.json";
import { selectors } from "../selectors/scheduleSelectors";

describe("verify persisted data", () => {
  it("passes", () => {
    mockLastThreeDay();
    mockGetScheduleItems();
    cy.visit(webURL);
    waitForPageLoad();
    cy.get(selectors.shackScheduleHeading).contains("Shack Schedule");
    verifyScheduleItems();
  });
});

describe("verify new line", () => {
  it("passes", () => {
    mockLastThreeDay();
    mockGetScheduleItems();
    cy.visit(webURL);
    waitForPageLoad();
    cy.get(selectors.addNewItemButton).click();
    mockGetScheduleItems();
    ScheduleItems.push({ id: 4, start_hour: 0, duration: 0 });

    mockInsertScheduleItem();
    mockGetScheduleItems("scheduleItemsInserted.json");
    modifyScheduleItem(4, 20, 12);
    console.log(`ScheduleItems: ${JSON.stringify(ScheduleItems)}`);
    verifyScheduleItems(selectors.plusButton);
  });
});

function mockLastThreeDay() {
  cy.intercept("GET", `${apiURL}/data/lastThreeDays`, {
    fixture: "empty.json",
  });
}

function mockGetScheduleItems(fixture?: string) {
  cy.intercept("GET", `${apiURL}/schedule`, {
    fixture: fixture || "scheduleItems.json",
  });
}

function mockInsertScheduleItem() {
  cy.intercept("POST", `${apiURL}/schedule/add`, {
    fixture: "scheduleItem.json",
  });
}

function verifyScheduleItems(additionalSelector?: string) {
  cy.get(selectors.shackScheduleItem).each((item, i) => {
    verifyScheduleItemControls(item, i, additionalSelector);
  });
}

function modifyScheduleItem(
  index: number,
  start_hour: number,
  duration: number
) {
  cy.get(selectors.shackScheduleItem)
    .eq(index - 1)
    .within(() => {
      cy.get(selectors.startTimeInput).clear().type(start_hour.toString());
      cy.get(selectors.durationInput).clear().type(duration.toString());
      cy.get(selectors.plusButton).click();
    });
  ScheduleItems[index - 1].start_hour = start_hour;
  ScheduleItems[index - 1].duration = duration;
}

function verifyScheduleItemControls(
  item: any,
  index: number,
  additionalSelector?: string
) {
  cy.get(item).within(() => {
    cy.get(selectors.startTimeInput)
      .should("exist")
      .then((element) => {
        expect(element).to.have.value(ScheduleItems[index].start_hour);
      });
    cy.get(selectors.durationInput)
      .should("exist")
      .then((element) => {
        expect(element).to.have.value(ScheduleItems[index].duration);
      });
    cy.get(selectors.trashButton).should("exist");
    if (item.find(additionalSelector).length > 0) {
      cy.get(additionalSelector!).should("exist");
    } else {
      cy.get(selectors.saveButton).should("exist");
    }
  });
}
