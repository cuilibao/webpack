/*

* node --> webpack
* */
//清空打包路径的插件
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
//打包html
let HtmlWebpackPlugin = require('html-webpack-plugin');
//分离css的插件
let MiniCssExtractPlugin = require("mini-css-extract-plugin");

//压缩css的插件
let OptimizeCss = require('optimize-css-assets-webpack-plugin');
//解决压缩css js不被压缩的问题
let TerserJsPlugin = require('terser-webpack-plugin');

let webpack = require('webpack');

let path = require('path');
module.exports = {
  mode: 'development',

  optimization: {//webpack 4.0之后出现的优化项
    minimizer: [new OptimizeCss(), new TerserJsPlugin()]//压缩css 注意 生产环境
  },

  devServer: {
    port: 3031,// 计算机 1024 - 65535
    contentBase: './dist'
  },

  entry: './src/index.js',
  //npm run build

  output: {
    /*hash: 根据文件名字 和内容生成的*/
    filename: "bundle.[hash].js",
    path: path.resolve(__dirname, 'bundle')
  },

  /*
  * css里面的loader
  *
  * loader原则 : 一个loader 只做一件事
  *
  * style-loader : 把style插入到 head中
  * css-loader : 把css模块 插入到 中 js
  *
  *
  * plugins
  * @babel/preset-env es6转换成es5
  * @babel/plugin-proposal-class-properties: 将es7转换成es5
  *
  * */
  module: {
    rules: [
      {//内置loader
        test: require.resolve('jquery'),
        use: 'expose-loader?$'
      }
      ,
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],//转化es6的话
            plugins: [
              ["@babel/plugin-proposal-decorators", {"legacy": true}],//装饰方法
              ["@babel/plugin-proposal-class-properties", {"loose": true}],//装饰类 loose: 宽松模式
              '@babel/plugin-transform-runtime'
            ]
          },
        }],
        include: path.resolve(__dirname, 'src'),//抽离哪个包
        exclude: /node_modules/  //排除哪个包


      },
      {
        test: /\.css$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          //postcss-loader : 加前缀
        }, 'css-loader', 'postcss-loader']//loader顺序的规律
      },
      {
        test: /\.(sc|sa)ss$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          //sass-loader: 解析sass 变成css
        }, 'css-loader', 'postcss-loader', 'sass-loader']//loader顺序的规律
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'main.css',
      // chunkFilename:'[id].css'
    }),
    //提供者
    new webpack.ProvidePlugin({
      "$": "jquery"
    })
  ],

  //排除之外  加入 在cdn引入了这个包 就不会打包这个包
  externals: {
    'jquery': '$'
  }
};
