import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    viewportWidth: 1280,
    viewportHeight: 720,
  },

  projectId: "4uyums",

  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
    supportFile: "cypress/support/component.ts",
    specPattern: "cypress/components/**/*.cy.{js,jsx,ts,tsx}",
  },

  env: {
    // Add environment variables for testing
    apiUrl: "http://localhost:1783",
  },
});
