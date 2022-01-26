const base = require('../../babel.config');

module.exports = {
  ...base,
  presets: [
    ...base.presets,
    "@babel/preset-react",
  ],
}
