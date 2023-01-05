module.exports = {
  chromeWebSecurity: false,
  defaultCommandTimeout: 180000,
  pageLoadTimeout: 180000,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config);
    },
  },
};
