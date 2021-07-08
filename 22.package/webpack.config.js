const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'none',
  entry: {
    'lager-number': './src/index.js',
    'lager-number.min': './src/index.js'
  },
  output: {
    filename: '[name].js',
    library: 'largerNumber',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js$/
      })
    ]
  }
};
