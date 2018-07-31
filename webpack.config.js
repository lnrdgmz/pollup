const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './src/client/index.js',
  output: {
      path: path.resolve(__dirname, 'public'),
    filename: 'main.js'
  },
  plugins: [
    new UglifyJsPlugin(),
  ]
};
