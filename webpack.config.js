var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [{
      test: /\.json$/,
      loader: "json-loader"
    }, {
      test: /\.js$/,
      loaders: ['react-hot', 'babel'],
      include: path.join(__dirname, 'src')
    }, {
      test: /\.css$/,
      loader: "style-loader!css-loader"
    }]
  }
};


// var path = require('path');
// var webpack = require('webpack');
// var minimize = process.argv.indexOf('--no-minimize') === -1;

// config = {
//   devtool: 'eval',
//   entry: [
//     'webpack-dev-server/client?http://localhost:3000',
//     'webpack/hot/only-dev-server',
//     './src/index'
//   ],
//   output: {
//     path: path.join(__dirname, 'dist'),
//     filename: 'bundle.js',
//     publicPath: '/static/'
//   },
//   plugins: [
//     new webpack.HotModuleReplacementPlugin()
//   ],
//   module: {
//     loaders: [{
//       test: /\.json$/,
//       loader: "json-loader"
//     }, {
//       test: /\.js$/,
//       loaders: ['react-hot', 'babel'],
//       include: path.join(__dirname, 'src')
//     }, {
//       test: /\.css$/,
//       loader: "style-loader!css-loader"
//     }]
//   }
// };

// if(minimize) { 
//     config.plugins = [
//       new webpack.optimize.UglifyJsPlugin(),
//       new webpack.DefinePlugin({
//         'process.env': {
//           'NODE_ENV': JSON.stringify('production')
//         }
//       })
//     ];
//     config.output.filename = 'bundle.min.js';
// }

// module.exports = config;