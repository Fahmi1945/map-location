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
    // ⬇️ --- PERBAIKAN: Sederhanakan 'static' --- ⬇️
    // Sajikan SEMUANYA dari folder 'src'
    // 'src/manifest.webmanifest' -> /manifest.webmanifest
    // 'src/public/images/logo.png' -> /public/icons/logo.png
    static: {
      directory: path.join(__dirname, 'src'),
    },
    // ⬆️ --- SELESAI PERBAIKAN --- ⬆️

    open: true,
    port: 9000, // Port Anda sudah benar
    client: {
      overlay: {
        errors: true,
        warnings: true,
      },
    },
  },
});