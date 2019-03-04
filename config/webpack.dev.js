'use strict';

const packageJSON               = require('../package.json');
const config                    = require('./webpack.common.js');
const webpackMerge              = require('webpack-merge');
const path                      = require('path');
const autoprefixer              = require('autoprefixer');
const MiniCssExtractPlugin      = require('mini-css-extract-plugin');
const dirs                      = packageJSON.config.directories;
const browserList               = packageJSON.config.browsers;
const entries                   = packageJSON.config.entries;
const configServer           	  = packageJSON.config.devServer;
const protocol                  = `http${configServer.secure ? 's' : ''}:`;

Object.keys(entries).filter((key, index) => {
  entries[key] = [path.resolve(dirs.source, entries[key])];
  if (!index) {
    entries[key].unshift(`webpack-dev-server/client?${protocol}//localhost:${configServer.port}`);
  }
  return key.indexOf('sa') !== 0;
});

module.exports = webpackMerge(config, {
  entry: entries,
  mode: 'development',
  output: {
    path: path.resolve(dirs.development),
    filename: `${dirs.files.js}[name].js`
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: `${dirs.files.html}[name].html`
            }
          },
          'extract-loader',
          {
            loader: 'html-loader',
            options: {
              interpolate: 'require'
            }
          },
          {
            loader: 'pug-html-loader',
            options: {
              pretty: true
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: () => [
                autoprefixer({
                  browsers: browserList
                })
              ]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded',
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /content[\\\/].*\.(jpg|png|gif|webp|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: `${dirs.files.images}[name].[ext]`
            }
          }
        ]
      },
      {
        test: /svg[\\\/].*\.svg$/,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              spriteFilename: `${dirs.files.sprite}sprite.svg`
            }
          }
        ]
      }
    ]
  },
  devServer: {
    contentBase: path.resolve('../', dirs.development),
    compress: true,
    disableHostCheck: true,
    https: configServer.secure,
    inline: true,
    lazy: false,
    quiet: false,
    stats: 'minimal',
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  },
  devtool: 'source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${dirs.files.css}[name].css`
    })
  ]
});