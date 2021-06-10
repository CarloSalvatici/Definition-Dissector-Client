const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: "./src/index.tsx",
  devtool: "inline-source-map",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, '../server/build')
  },
  devServer: {
     // Serve index.html as the base
    contentBase: './',

    // Enable compression
    compress: true,

    // Enable hot reloading
    hot: true,

    port: 3000,

    // Public path is root of content base
    publicPath: '/',

    proxy: {
      '/api': {
        target: 'http://localhost:5000'
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss?$/,
        use: [
          'style-loader','css-loader',
          'sass-loader'
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: './index.html'
    })
  ]
}