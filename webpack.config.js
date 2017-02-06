var path = require('path');
var webpack = require('webpack');
var nodeModulesDir = path.resolve(__dirname, '../node_modules');

var config = {
  entry: {
    app: path.resolve(__dirname, './app/js/index.js'),
    // vendors: ['matter-js']
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, /*exclude: [/node_modules/],*/ loader: 'babel-loader', query: { presets: ['es2015'] }}
      // { test: /\.sass$/, loaders: ['style-loader', 'css-loader', 'sass-loader'] }
    ]
  },
  // plugins: [
  //   new webpack.optimize.CommonsChunkPlugin({ name: 'vendors', filename: 'vendors.bundle.js' })
  // ]
};

module.exports = config;