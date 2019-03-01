'use strict';

const dirs           	          = require('./package.json').config.directories;
const config                    = require('./config/webpack.prod.js');
const webpack                   = require('webpack');
const fs                        = require('fs');
const del                       = require('del');

const compiler = webpack(config);
const statsOptions = {
  assets: false,
  builtAt: false,
  colors: true,
  children: false,
  chunks: false,
  entrypoints: false,
  hash: false,
  modules: false,
  version: false
};
if (fs.existsSync(dirs.production)) del.sync(`${dirs.production}/**/*`);
compiler.hooks.compile.tap('compile', () => console.log('Building frontend...'));
compiler.run((error, stats) => {
  if (!error) {
    console.log('Compiled successfully.');
    console.log(stats.toString(statsOptions));
  } else {
    console.error(error.stack || error);
    if (error.details) {
      console.error(error.details);
    }
  }
});