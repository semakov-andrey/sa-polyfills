'use strict';

const dirs           	          = require('./package.json').config.directories;
const config                    = require('./config/webpack.prod.js');
const { statsOptions }          = require('./config/utils.js');
const webpack                   = require('webpack');
const fs                        = require('fs');
const del                       = require('del');

if (fs.existsSync(dirs.production)) del.sync(`${dirs.production}/**/*`);

console.info('Building...');
const compiler = webpack(config);
compiler.run((error, stats) => {
  if (error) {
    console.error(error.stack || error);
    if (error.details) {
      console.error(error.details);
    }
  } else {
    console.info(stats.toString(statsOptions));
    console.info('Сompiled successfully.');
  }
});