const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 自动清理构建
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 分离css
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin'); // 命令行显示优化
const Webpack = require('webpack');
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');  // 为模块提供了中间缓存
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin'); // 自动导入动态链接库
const PurgeCSSPlugin = require('purgecss-webpack-plugin'); // 自动删除没用到的css
const WebpackBar = require('webpackbar'); // 显示打包进度
const CopyPlugin = require('copy-webpack-plugin'); // 拷贝静态文件

const manifest = require('../build/react.manifest.json');

const PATHS = {
  src: path.join(__dirname, '../src'),
};

const projectRoot = process.cwd();
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(projectRoot, './src/page/*/index.tsx'));
  entryFiles.forEach((entryFile) => {
    const match = entryFile.match(/\/src\/page\/(.*)\/index\.tsx?/);
    const pageName = match && match[1];
    entry[pageName] = entryFile;
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, `../src/page/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: [`${pageName}`, 'vendors'],
      }),
    );
  });

  return {
    entry,
    htmlWebpackPlugins,
  };
};
const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
  entry,
  stats: 'errors-only',
  output: {
    filename: 'js/[name].[hash:8].js',
    path: path.resolve(__dirname, '../dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      '@': path.resolve('../src'), // 这样配置后 @ 可以指向 src 目录
    },
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      cacheGroups: {
        commons: {
          name: 'vendors',
          chunks: 'all',
          test: /src/, // 条件
          minChunks: 2,
          priority: -10,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              worker: true,
            },
          },
          'cache-loader',
          'babel-loader',
        ],
      },
      {
        test: /\.css/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader, // 分离css文件
            options: {
              publicPath: '/css',
            },
          },
          'cache-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75, // 750设计稿
              remPrecision: 8, // 小数点后几位
            },
          },
        ],
      },
      {
        test: /\.less/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader, // 分离css文件
            options: {
              publicPath: '/css',
            },
          },
          'cache-loader',
          'css-loader',
          'less-loader',
          'postcss-loader',
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75, // 750设计稿
              remPrecision: 8, // 小数点后几位
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|bmp|gif|svg)/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              name: 'images/[hash:8].[name].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
      {
        test: /\.(woff|ttf|eot|svg|otf)$/,
        use: {
          // url内部内置了file-loader
          loader: 'url-loader',
          options: {
            // 如果要加载的图片大小小于10K的话，就把这张图片转成base64编码内嵌到html网页中去
            limit: 10 * 1024,
            name: 'fonts/[hash:8].[name].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), // 清理构建产物
    new MiniCssExtractPlugin({
      // 分离css文件
      filename: 'css/[name].[hash:8].css',
      chunkFilename: 'css/[id].[hash:8].css',
    }),
    new FriendlyErrorsWebpackPlugin(), // 命令行提示优化
    // new HardSourceWebpackPlugin()  //为模块提供了中间缓存 webpack5 内置
    new Webpack.DllReferencePlugin({
      manifest,
    }),
    new AddAssetHtmlPlugin({
      filepath: path.resolve(__dirname, '../build/react.dll.js'),
      outputPath: '../dist/js',
      publicPath: 'js',
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    }),
    new WebpackBar(),
    new CopyPlugin({
      patterns: [
        {
          context: path.resolve(__dirname, '../public'),
          from: '*',
          to: path.resolve(__dirname, '../dist'),
          toType: 'dir',
        },
      ],
    }),
  ].concat(htmlWebpackPlugins),
};
