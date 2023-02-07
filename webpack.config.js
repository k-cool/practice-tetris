const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/tetris.js',
  output: {
    filename: 'every-tetris.js',
    path: path.resolve(__dirname, './public/js'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
