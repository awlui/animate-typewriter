const {resolve} = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
let isProd = process.env.NODE_ENV === 'production';
console.log(isProd)
module.exports = env => {
  return {
    entry: './js/app.js',
    output: {
      filename: 'bundle.js',
      path: resolve(__dirname, 'dist'),
      libraryTarget: 'umd',
      library: 'Typewriter'
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