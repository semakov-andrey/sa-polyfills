const packageJSON = require('./package.json');

const { config: { directories: { production: dir } } } = packageJSON;

module.exports = {
  detection: require(`./${dir}/sa-detection.js`),
  Closest: require(`./${dir}/sa-сlosest.js`),
  GridAutoPlacement: require(`./${dir}/sa-grid-auto-placement.js`)
};