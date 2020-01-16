const packageJSON = require('./package.json');

const { config: { directories: { production: dir } } } = packageJSON;

module.exports = {
  detection: require(`./${dir}/sa-detection`),
  Closest: require(`./${dir}/sa-slosest`),
  GridAutoPlacement: require(`./${dir}/sa-grid-autoplacement`)
};