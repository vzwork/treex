const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const htmlPlugin = new HtmlWebPackPlugin({
  template: './src/index.html',
  filename: './index.html',
});

module.exports = {
  experiments: {
    topLevelAwait: true, 
  },
  plugins: [htmlPlugin],
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        test: /\.css$/,
        include: [__dirname + '/src'],
        use: [{loader: 'style-loader'},{ loader: 'css-loader'}]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        include: [__dirname + '/src'],
        use: [{loader: 'file-loader'}]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
  },
};