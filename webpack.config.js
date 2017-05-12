const {resolve} = require('path');
const webpack = require('webpack');

module.exports = env => {
  return {
    entry: './js/app.js',
    output: {
      filename: 'bundle.js',
      path: resolve(__dirname, 'dist')
    },
    context: resolve(__dirname, 'src'),
    devtool: env.prod ? 'source-map': 'eval',
    module: {
      loaders: [
        {test: /\.js$/, loader: 'babel-loader!eslint-loader', exclude: /node_modules/},
        {test: /\.css$/, loader: 'style-loader!css-loader'}
      ]
    }
  }
}