const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('lodash/merge');
const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

webpackConfig.output.filename = '[name].min.js';

webpackConfig.module.loaders = [{
  include: /src/,
  loader: ExtractTextPlugin.extract(
    'style',
    [
      'css?importLoaders=3',
      'postcss',
      'resolve-url',
      'sass',
    ].join('!')
  ),
  test: /\.scss$/,
}];

// Add `forceEnv: 'prod'` to all babel postLoaders
webpackConfig.module.postLoaders = webpackConfig.module.postLoaders.map((loader) => {
  if (loader.loader.indexOf('babel') !== 0) {
    return loader;
  }

  return merge(
    {},
    loader,
    {
      query: {
        forceEnv: 'production',
      },
    }
  );
});

webpackConfig.plugins = [
  new CleanWebpackPlugin('dist', {
    root: path.resolve(__dirname, '..'),
  }),

  new ExtractTextPlugin('[name].min.css'),

  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.UglifyJsPlugin({
    comments: false,
  }),
];

module.exports = webpackConfig;
