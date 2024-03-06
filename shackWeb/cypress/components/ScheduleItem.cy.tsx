import { on } from "events";
import ScheduleItem from "../../src/components/ScheduleItem";
import { scheduleItem } from "../../src/util/models";
import { selectors } from "../selectors/scheduleSelectors";

function onUpdate(index: number, updatedItem: scheduleItem) {
  console.log(index, updatedItem);
}

function onDelete(index: number, id: number) {
  console.log(index, id);
}

describe("Schedule Item with save button", () => {
  it("save button", () => {
    cy.mount(
      <ScheduleItem
        item={{
          id: 1,
          start_hour: 18,
          duration: 30,
        }}
        index={1}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    );
    cy.get(selectors.shackScheduleItem).within(() => {
      cy.get(selectors.startTimeInput).should("have.value", "18");
      cy.get(selectors.durationInput).should("have.value", "30");
      cy.get(selectors.saveButton).should("exist");
      cy.get(selectors.trashButton).should("exist");
    });
  });
});``

describe("Schedule Item with plus button", () => {
  it("plus button", () => {
    cy.mount(
      <ScheduleItem
        item={{
          start_hour: 18,
          duration: 30,
        }}
        index={1}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    );
    cy.get(selectors.shackScheduleItem).within(() => {
      cy.get(selectors.startTimeInput).should("have.value", "18");
      cy.get(selectors.durationInput).should("have.value", "30");
      cy.get(selectors.plusButton).should("exist");
      cy.get(selectors.trashButton).should("exist");
    });
  });
});
