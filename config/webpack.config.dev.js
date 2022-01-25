const fs = require('fs');
const { merge } = require('webpack-merge');
const config = require('./webpack.config.js');

module.exports = merge(config, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    host: 'localhost',
    port: 8080,
    static: './',
    server: {
      type: 'https',
      options: {
        key: './config/localhost.key',
        cert: './config/localhost.crt',
      },
    },
  },
})