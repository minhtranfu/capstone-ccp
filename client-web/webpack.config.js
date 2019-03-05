'use strict';

const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const MinifyPlugin = require("babel-minify-webpack-plugin");
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const CleanPlugin = require('./utils/clean-plugin');
const NodeUtils = require('./src/services/common/node-service');

const appConfig = require('./config/config');

const config = {
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.[hash].js',
    chunkFilename: '[name].bundle.[hash].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new CleanPlugin({
      files: ['dist/*']
    }),
    new MiniCssExtractPlugin({
      filename: NodeUtils.isProduction() ? '[name].[hash].css' : '[name].css',
      chunkFilename: NodeUtils.isProduction() ? '[id].[hash].css' : "[id].css"
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      inject: 'body'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(
          process.env.NODE_ENV
        ),
        APP_CONFIG: JSON.stringify(
          appConfig
        )
      }
    })
  ],
  module: {
    exprContextCritical: false, // Suppress "The request of a dependency is an expression"
    rules: [
      {
        test: /\.(js|jsx)$/,
        loaders: 'babel-loader',
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.(scss|css)$/,
        use:
          NodeUtils.isProduction()
            ? [MiniCssExtractPlugin.loader, 'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  plugins: () => [
                    autoprefixer({
                      browsers: ['last 2 version']
                    })
                  ]
                }
              }, 'sass-loader']
            : ['style-loader', 'css-loader', 'sass-loader'],
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'node_modules')
        ]
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
        loader: 'url-loader?limit=10000&name=[name]-[hash].[ext]',
        include: [
          path.join(__dirname, 'src'),path.join(__dirname, 'node_modules')
        ]
      },
      {
        test: /\.ico$/,
        loader: 'file-loader?name=[name].[ext]'
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        include: path.join(__dirname, 'src')
      }
    ]
  }
};

if (NodeUtils.isProduction()) {
  config.entry = './src/Bootstrap';
  config.mode = 'production';
  // config.optimization.push(new MinifyPlugin());
} else {
  config.devtool = 'eval';
  config.mode = 'development';
  config.entry = [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://localhost:${appConfig.example.port}`,
    'webpack/hot/only-dev-server',
    './src/Bootstrap'
  ];
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );
}

module.exports = config;
