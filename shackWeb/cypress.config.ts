import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  projectId: "4uyums",

  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },
});
