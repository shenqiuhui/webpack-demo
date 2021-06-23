'use strict'

const path = require('path');

module.exports = {
  // 单入口
  // entry: './src/index.js',
  // 多入口
  entry: {
    index: './src/index.js',
    search: './src/search.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  mode: 'production'
};
