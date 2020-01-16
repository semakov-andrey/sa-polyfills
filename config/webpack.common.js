'use strict';

const dirs                      = require('../package.json').config.directories;
const SpriteLoaderPlugin        = require('svg-sprite-loader/plugin');

Object.keys(dirs.files).forEach(folder => {
  if (dirs.files[folder] !== '') {
    dirs.files[folder] += '/';
  }
});

module.exports = {
  output: {
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [ '@babel/preset-env' ],
              plugins: [ '@babel/plugin-proposal-class-properties' ]
            }
          }
        ]
      }, {
        test: /\.(woff|woff2|ttf|otf)$/,
        use: [
            {
            loader: 'file-loader',
            options: {
              name: `${dirs.files.fonts}[name].[ext]`
            }
          }
        ]
      }, {
        test: /content[\\/].*\.mp4$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: `${dirs.files.images}[name].[ext]`
            }
          }
        ]
      }, {
        test: /other[\\/].*$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: `${dirs.files.other}[name].[ext]`
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new SpriteLoaderPlugin()
  ]
};