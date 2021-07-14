const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const autoprefixer = require('autoprefixer');

const projectRoot = process.cwd();

const setMpa = () => {
  const result = {
    entry: {},
    htmlWebpackPlugins: [],
  };

  const entryFiles = glob.sync(path.join(projectRoot, './src/pages/*/index.js'));

  return entryFiles.reduce((res, file) => {
    const pageName = file.match(/src\/pages\/(.*)\/index\.js/)[1];

    res.entry[pageName] = file;
    res.htmlWebpackPlugins.push(new HtmlWebpackPlugin({
      template: path.resolve(projectRoot, `src/pages/${pageName}/index.html`),
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
      },
    }));

    return res;
  }, result);
};

const { entry, htmlWebpackPlugins } = setMpa();

module.export = {
  entry,
  output: {
    path: path.join(projectRoot, 'dist'),
    filename: '[name].[chunkhash:8].js'
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: 'babel-loader',
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
                  autoprefixer,
                ],
              },
            },
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75, // 一个 rem 代表 75px，适合 750 的视觉稿
              remPrecesion: 8, // 转换成 rem 后面小数点位数
            },
          },
        ],
      },
      {
        test: /.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
        ],
      },
      {
        test: /.(png|jpg|gif|jpeg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[hash:8].[ext]',
          },
        }],
      },
      {
        test: /.(woff|woff2|eot|ttf|otf|ttc)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[hash:8].[ext]',
          },
        }],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
    }),
    new FriendlyErrorsWebpackPlugin(),
    function errorPlugin() {
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') === -1) {
          Error('build error');
          process.exit(1);
        }
      });
    },
  ].concat(htmlWebpackPlugins),
  stats: 'errors-only',
};
