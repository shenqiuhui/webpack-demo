const { merge } = require('webpack-merge');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const baseConfig = require('./webpack.base.conf');

const ssrConfig = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /.css$/,
        use: 'ignore-loader',
      },
      {
        test: /.less$/,
        use: 'ignore-loader',
      },
    ],
  },
  plugins: [
    new CssMinimizerPlugin(),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://unpkg.com/react@17/umd/react.production.min.js',
          global: 'React',
        },
        {
          module: 'react-dom',
          entry: 'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
          global: 'ReactDOM',
        },
      ],
    }),
  ],
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
        },
      },
    },
  },
};

module.exports = merge(baseConfig, ssrConfig);
