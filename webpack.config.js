const path = require("path");
const webpack = require("webpack");
const OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin");
// webpack 4 MiniCssExtractPlugin 代替 ExtractTextPlugin
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const CopyWebpackPlugin = require("copy-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const { CheckerPlugin } = require("awesome-typescript-loader");

const fs = require("fs");
const file = path.resolve(__dirname, "config/site.json");
const SITE_INFO = JSON.parse(fs.readFileSync(file));

// 发布环境
const RELEASE_ENV = process.env.RELEASE_ENV || "DEV";
// 打包环境
const NODE_ENV = {
  DEV: "development",
  TEST: "production",
  MASTER: "production",
}[RELEASE_ENV];
process.env.NODE_ENV = NODE_ENV;
console.log(NODE_ENV);

const publicPath = "/";
module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    // app: ["babel-polyfill", "./src/app/app.ts"],
    app: "./src/app/index.bootstrap.ts",
  },
  output: {
    filename: "scripts/[name]_[hash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: publicPath,
  },
  resolve: {
    // 配置模块如何解析
    extensions: [".vue", ".ts", ".tsx", ".js", ".jsx"],
    alias: {
      vue:
        process.env.NODE_ENV !== "production"
          ? "vue/dist/vue.js"
          : "vue/dist/vue.min.js",
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          "babel-loader",
          {
            loader: "awesome-typescript-loader",
            options: {
              appendTsSuffixTo: [/\.vue$/],
              useBabel: true,
              useCache: true,
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: "vue-loader",
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          process.env.NODE_ENV !== "production"
            ? "vue-style-loader"
            : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              publicPath: publicPath + "images/",
              outputPath: "images/",
            },
          },
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[hash].[ext]",
              publicPath: publicPath + "styles/",
              outputPath: "styles/",
            },
          },
        ],
      },
      {
        test: /\.(json)$/,
        type: "javascript/auto",
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              publicPath: publicPath + "config/",
              outputPath: "config/",
            },
          },
        ],
      },
    ],
  },
  devtool: NODE_ENV === "production" ? "none" : "inline-source-map",
  devServer: {
    // redirect
    historyApiFallback: {
      rewrites: [
        {
          from: /^\/$/,
          to: "/index.html",
        },
      ],
      disableDotRule: true,
    },
    // host: "192.168.1.199",
    host: "127.0.0.1",
    hot: true,
    port: 8080,
    publicPath: publicPath,
    contentBase: path.resolve(__dirname, "dist"),
    disableHostCheck: true, // Invalid Host header 服务器域名访问出现的问题
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "commons",
          chunks: "initial",
          minChunks: 2,
        },
      },
    },
  },
  plugins: [
    new VueLoaderPlugin(),
    new CheckerPlugin(),
    new webpack.DefinePlugin({
      // "process.env": { NODE_ENV: '"development"' } ,
      PUBLIC_PATH: JSON.stringify(publicPath),
      SITE_INFO: JSON.stringify(SITE_INFO),
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     // 压缩配置
    //     warnings: false,
    //     drop_console: false,
    //     drop_debugger: false
    //   },
    //   sourceMap: true
    // }),

    // 将js中引入的css分离的插件
    new MiniCssExtractPlugin({
      filename: "styles/[name]_[hash].css",
    }),
    //压缩提取出的css，并解决ExtractTextPlugin分离出的js重复问题(多个文件引入同一css文件)
    new OptimizeCSSPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html", // 生成的html文件名
      template: "./src/app/index.html", // 依据的模板
      chunks: ["app", "commons"],
      inject: true,
      minify: {
        //压缩配置
        removeComments: true, //删除html中的注释代码
        collapseWhitespace: true, //删除html中的空白符
        removeAttributeQuotes: true, //删除html元素中属性的引号
      },
      // chunksSortMode: "dependency" //按dependency的顺序引入
      chunksSortMode: "none",
      SITE_INFO,
    }),

    // new CopyWebpackPlugin([
    //   {
    //     from: path.resolve(__dirname, "../static"),
    //     to: "/static",
    //     ignore: [".*"] //忽视.*文件
    //   }
    // ])
  ],
};
