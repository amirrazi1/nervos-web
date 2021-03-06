const fs = require('fs')
const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const HtmlPlugin = require('html-webpack-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')

const baseConfig = require('./webpack.config.base')

const manifest = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../lib/manifest.json')),
)

/* eslint-disable import/no-dynamic-require */
const reactManifest = require(path.resolve(__dirname, '../lib/react_manifest'))
const styledComponentsManifest = require(path.resolve(
  __dirname,
  '../lib/styledComponents_manifest',
))
/* eslint-enable import/no-dynamic-require */

const devConfig = {
  entry: {
    app: [
      'webpack/hot/only-dev-server',
      'webpack-dev-server/client?http://localhost:8080',
      'react-hot-loader/patch',
      path.resolve(__dirname, '../src/index.tsx'),
    ],
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 2,
              localIdentName: '[local]__[name]--[hash:base64:5]',
            },
          },
          'sass-loader',
        ],
        include: [
          path.resolve(__dirname, '../src/'),
          path.resolve(__dirname, '../node_modules/normalize.css'),
        ],
      },
    ],
  },
  devtool: 'eval',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NamedChunksPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        FONT: JSON.stringify('../styles/fonts'),
      },
    }),
    new DashboardPlugin(),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: reactManifest,
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: styledComponentsManifest,
    }),
    new HtmlPlugin({
      title: '开发',
      template: path.resolve(__dirname, '../src/templates/index.html'),
      react: `../lib/${manifest['react.js']}`,
      styledComponents: `../lib/${manifest['styledComponents.js']}`,
    }),
  ],
  devServer: {
    hot: true,
    historyApiFallback: true,
  },
}

module.exports = merge(baseConfig, devConfig)
