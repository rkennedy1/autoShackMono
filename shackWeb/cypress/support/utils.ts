export const apiURL: string = `http://${Cypress.env("baseURL")}:${Cypress.env(
  "apiPort"
)}`;
export const webURL: string = `http://${Cypress.env("baseURL")}:${Cypress.env(
  "webPort"
)}`;

export const searchByAriaLabel = (label: string): string =>
  `[aria-label="${label}"]`;

export const searchByAutomationId = (input: string): string =>
  `[automationid="${input}"]`;

export const searchByDataAutomationId = (automationId: string): string =>
  `[data-automation-id="${automationId}"]`;

export const searchByDataAutomationLabel = (automationLabel: string): string =>
  `[data-automation-label="${automationLabel}"]`;

export const searchByDataMetadataId = (metadataId: string): string =>
  `[data-metadata-id="${metadataId}"]`;

export const searchContainsDataMetadataId = (metadataId: string): string =>
  `[data-metadata-id*="${metadataId}"]`;

export const searchById = (id: string): string => `[id="${id}"]`;

export const searchContainsId = (id: string): string => `[id*="${id}"]`;

export const searchContainsDataAssociatedWidget = (
  associatedWidget: string
): string => `[data-associated-widget*=${associatedWidget}]`;

export const searchByType = (type: string): string => `[type="${type}"]`;

export const searchByButtonLabel = (label: string) =>
  `button > span:contains('${label}')`;

export const getRandomNumber = (max: number): number =>
  Math.floor(Math.random() * Math.floor(max));

export const waitForPageLoad = () => {
  cy.get(searchContainsId("shackScheduleItem"), { timeout: 10000 }).should(
    "be.visible"
  );
};
