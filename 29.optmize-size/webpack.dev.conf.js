'use strict'

const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const setMpa = () => {
  const result = {
    entry: {},
    htmlWebpackPlugins: []
  };

  const entryFiles = glob.sync(path.join(__dirname, './src/pages/*/index.js'));

  return entryFiles.reduce((result, file) => {
    const pageName = file.match(/src\/pages\/(.*)\/index\.js/)[1];

    result.entry[pageName] = file;
    result.htmlWebpackPlugins.push(new HtmlWebpackPlugin({
      template: path.resolve(__dirname, `src/pages/${pageName}/index.html`),
      filename: `${pageName}.html`,
      chunks: [pageName], // 引入哪些 chunks
      inject: true, // js、css 自动注入到 html
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      }
    }));

    return result;
  }, result);
};

const { entry, htmlWebpackPlugins } = setMpa();

module.exports = {
  entry,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /.js$/,
        use: 'babel-loader'
      },
      {
        test: /.css$/,
        // 链式调用和执行顺序从右到左
        use: ['style-loader', 'css-loader']
      },
      {
        test: /.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /.(png|jpg|gif|jpeg)$/,
        // use: 'file-loader'
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10240
          }
        }]
      },
      {
        test: /.(woff|woff2|eot|ttf|otf|ttc)$/,
        use: 'file-loader'
      }
    ]
  },
  plugins: [
    // 将 HMR Runtime 注入到 bundle.js
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin(),
  ].concat(htmlWebpackPlugins),
  devServer: {
    contentBase: './dist',
    hot: true,
    stats: 'errors-only',
  },
  devtool: 'cheap-source-map'
};
