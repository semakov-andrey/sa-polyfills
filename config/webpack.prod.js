'use strict';

const packageJSON               = require('../package.json');
const config                    = require('./webpack.common.js');
const webpackMerge              = require('webpack-merge');
const path                      = require('path');
const autoprefixer              = require('autoprefixer');
const PostCSSAssetsPlugin       = require('postcss-assets-webpack-plugin');
const MiniCssExtractPlugin      = require('mini-css-extract-plugin');
const cssnano                   = require('cssnano');
const UglifyJsPlugin            = require('uglifyjs-webpack-plugin');
const SpriteLoaderPlugin        = require('svg-sprite-loader/plugin');
const dirs                      = packageJSON.config.directories;
const browserList               = packageJSON.config.browsers;
const entries                   = packageJSON.config.entries;

Object.keys(entries).forEach(key => {
  entries[key] = [path.resolve(dirs.source, entries[key])];
});

module.exports = webpackMerge(config, {
  entry: entries,
  mode: 'production',
  output: {
    path: path.resolve(dirs.production)
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name(file) {
                const name = file.replace(/\\/g, '/').split('/').slice(-3, -2)[0];
                return `${dirs.files.html}${name}.html`;
              }
            }
          },
          'extract-loader',
          {
            loader: 'html-loader',
            options: {
              interpolate: 'require',
              minimize: true,
              removeComments: true,
              collapseWhitespace: true,
              conservativeCollapse: false,
              quoteCharacter: '"',
              minifyCSS: true,
              minifyJS: true,
              removeAttributeQuotes: true,
              removeOptionalTags: true
            }
          },
          'pug-html-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
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
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 80
              },
              gifsicle: {
                interlaced: false
              },
              optipng: {
                optimizationLevel: 7
              },
              svgo: {
                plugins: [
                  {removeViewBox: false},
                  {convertColors: {shorthex: true}},
                  {removeEmptyAttrs: false}
                ]
              }
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
          },
          'svg-fill-loader',
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                {removeViewBox: false},
                {convertColors: {shorthex: true}},
                {removeEmptyAttrs: false}
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${dirs.files.css}[name].css`
    }),
    new SpriteLoaderPlugin({
      plainSprite: true
    })
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        test: /\.js$/
      }),
      new PostCSSAssetsPlugin({
        test: /\.css$/,
        log: false,
        plugins: [
          autoprefixer({
            browsers: browserList
          }),
          cssnano({
            preset: ['default', {
              discardComments: {
                removeAll: true
              },
              minifyFontValues: {
                removeQuotes: false
              }
            }]
          })
        ]
      })
    ]
  },
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 4096000
  }
});