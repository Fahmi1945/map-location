const path = require('path');
const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  devServer: {
    static: [
      {
        // Ini menyajikan 'manifest.webmanifest' dari 'src/'
        directory: path.join(__dirname, 'src/'),
        publicPath: '/',
      },
      {
        // Ini menyajikan 'logo.png' dan 'icons' dari 'src/public/'
        directory: path.join(__dirname, 'src/public/'),
        publicPath: '/',
      },
    ],
    open: true,
    port: 9000,
    client: {
      overlay: {
        errors: true,
        warnings: true,
      },
    },
  },
});
