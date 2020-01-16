'use strict';

const config                    = require('./config/webpack.dev.js');
const packageJSON           	  = require('./package.json');
const webpack                   = require('webpack');
const WebpackDevServer          = require('webpack-dev-server');
const logger                    = require('./config/logger.js');

const { config: { devServer: { host, port } } } = packageJSON;

const compiler = webpack(config);
const server = new WebpackDevServer(compiler, config.devServer);

server.listen(port, host, logger('dev server', port));