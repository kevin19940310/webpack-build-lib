const merge = require('webpack-merge').default;
const TerserPlugin = require('terser-webpack-plugin'); // 压缩js  支持es6
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const smw = new SpeedMeasureWebpackPlugin();
const cssnano = require('cssnano');
// 压缩css
const prodConfig = smw.wrap({
  mode: 'production',
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
      // 压缩css资源的
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        // cssnano是PostCSS的CSS优化和分解插件。cssnano采用格式很好的CSS，并通过许多优化，以确保最终的生产环境尽可能小。
        cssProcessor: cssnano,
      }),
    ],
  },
  plugins: [new BundleAnalyzerPlugin()],
});
const baseConfig = require('./webpack.base');

const config = merge(baseConfig, prodConfig);

module.exports = config;
