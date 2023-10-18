module.exports = {
  chromeWebSecurity: false,
  defaultCommandTimeout: 5000,
  pageLoadTimeout: 5000,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config);
    },
  },
};
