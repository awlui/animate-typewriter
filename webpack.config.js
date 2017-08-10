const {resolve} = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkg = require('./package.json');
let isProd = process.env.NODE_ENV === 'production';
console.log(isProd)
console.log(pkg.dependencies);
module.exports = env => {
  return {
    entry: {

      app: './js/app.js',
    },
    output: {
      filename: '[name].[chunkhash].js',
      path: resolve(__dirname, 'dist'),
      libraryTarget: 'umd',
      library: 'Typewriter'
    },
    externals: {
      'uuid': 'node-uuid'
    },
    context: resolve(__dirname, 'src'),
    devtool: env.prod ? 'source-map': 'eval',
    module: {
      loaders: [
        {test: /\.js$/, loader: 'babel-loader!eslint-loader', exclude: /node_modules/},
        {test: /\.css$/, loader: 'style-loader!css-loader'}
      ]
    },
  plugins: [
    isProd ? undefined : new HtmlWebpackPlugin({
      template: '../node_modules/html-webpack-template/index.ejs',
      title: 'Typewriter Lib',
      appMountId: 'root',
      inject: false
    })
  ].filter(p => !!p)
  }
}