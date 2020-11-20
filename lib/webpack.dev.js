const merge = require('webpack-merge').default;

const devConfig = {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: '../dist',
    index: 'center.html',
    compress: true,
    port: 8007,
    hot: true,
    open: true,
  },
};
const baseConfig = require('./webpack.base');

module.exports = merge(baseConfig, devConfig);
