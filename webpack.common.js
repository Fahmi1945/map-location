const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin'); // 1. GANTI INI
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/scripts/index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/public/'),
          to: path.resolve(__dirname, 'dist/public/'),
        },
        {
          from: path.resolve(__dirname, 'src/manifest.webmanifest'),
          to: path.resolve(__dirname, 'dist/'),
        },
      ],
    }),
    
    // 2. GANTI DARI 'GenerateSW' MENJADI 'InjectManifest'
    new InjectManifest({
      swSrc: path.resolve(__dirname, 'src/service-worker.js'), // File sumber SW kita
      swDest: 'service-worker.js', // File keluaran di 'dist/'
    }),
  ],
};