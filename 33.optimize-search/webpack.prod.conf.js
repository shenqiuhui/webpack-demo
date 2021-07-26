'use strict'

const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const Happypack = require('happypack');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const smp = new SpeedMeasureWebpackPlugin();

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
      chunks: ['defaultVendors', 'default', pageName], // 引入哪些 chunks
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

module.exports = smp.wrap({
  entry,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash:8].js'
  },
  mode: 'production',
  // stats: 'errors-only',
  resolve: {
    alias: {
      'react': path.resolve(__dirname, './node_modules/react/umd/react.production.min.js'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom/umd/react-dom.production.min.js')
    },
    extensions: ['.js'],
    mainFields: ['main']
  },
  module: {
    rules: [
      {
        test: /.js$/,
        include: path.resolve('src'),
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: 3
            }
          },
          'babel-loader?cacheDirectory=true'
        ]
        // use: 'babel-loader'
        // use: 'happypack/loader'
      },
      {
        test: /.css$/,
        // 链式调用和执行顺序从右到左
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('autoprefixer')
                ]
              }
            }
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75, // 一个 rem 代表 75px，适合 750 的视觉稿
              remPrecesion: 8 // 转换成 rem 后面小数点位数
            }
          }
        ]
      },
      {
        test: /.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /.(png|jpg|gif|jpeg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[hash:8].[ext]'
          }
        }]
      },
      {
        test: /.(woff|woff2|eot|ttf|otf|ttc)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[hash:8].[ext]'
          }
        }]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css'
    }),
    new CssMinimizerPlugin(),
    new CleanWebpackPlugin(),
    // new HtmlWebpackExternalsPlugin({
    //   externals: [
    //     {
    //       module: 'react',
    //       entry: 'https://unpkg.com/react@17/umd/react.production.min.js',
    //       global: 'React'
    //     },
    //     {
    //       module: 'react-dom',
    //       entry: 'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
    //       global: 'ReactDOM'
    //     }
    //   ]
    // }),
    new FriendlyErrorsWebpackPlugin(),
    // function () {
    //   this.hooks.done.tap('done', (stats) => {
    //     if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') === -1) {
    //       console.log('build error');
    //       process.exit(1);
    //     }
    //   });
    // }
    // new BundleAnalyzerPlugin(),
    // new Happypack({
    //   loaders: ['babel-loader']
    // })
    new webpack.DllReferencePlugin({
      manifest: require('./build/library/library.json')
    }),
  ].concat(htmlWebpackPlugins),
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          name: 'commons',
          priority: -20,
          reuseExistingChunk: true,
        }
      }
    },
    minimizer: [
      new TerserWebpackPlugin({
        parallel: true,
      })
    ]
  }
});
