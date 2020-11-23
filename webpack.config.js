const path = require("path");
const webpack = require("webpack");
const OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const CopyWebpackPlugin = require("copy-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

const fs = require("fs");
require(path.resolve(__dirname, "config/config.js"));
const SITE_INFO = config_env;

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

const extractLESS = new MiniCssExtractPlugin({
  filename: "styles/[name]-one-[contenthash].css",
  allChunks: true,
});
const extractSCSS = new MiniCssExtractPlugin(
  "styles/[name]-two-[contenthash].css",
);
const isMaster = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";

const PUBLIC_PATH = "/";
// global PUBLIC_PATH = "/"
module.exports = {
  // mode: process.env.NODE_ENV,
  entry: {
    app: ["./src/app/index.bootstrap.ts"],
  },
  output: {
    filename: "scripts/[name]_[hash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: PUBLIC_PATH,
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   exclude: path.resolve(__dirname, "/node_modules"),
      //   // exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file),
      //   use: {
      //     loader: "babel-loader"
      //   }
      // },
      // {
      //   test: /\.jsx?$/,
      //   loader: "babel-loader",
      // },
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
      // {
      //   test: /\.css$/,
      //   use: [
      //     MiniCssExtractPlugin.loader,
      //     {
      //       loader: "css-loader",
      //       options: {
      //         minimize: process.env.NODE_ENV === "production"
      //       }
      //     }
      //   ]
      // },
      {
        test: /\.scss$/,
        use: [
          isDev ? "vue-style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              sourceMapContents: false,
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?/,
        use: [
          {
            loader: "file-loader",
            query: {
              limit: 10000,
              name: "[name].[hash:7].[ext]",
              publicPath: PUBLIC_PATH + "imgs/",
              outputPath: "imgs/",
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "file-loader",
        query: {
          limit: 10000,
          name: "[name].[hash:7].[ext]",
          publicPath: PUBLIC_PATH + "fonts/",
          outputPath: "fonts/",
        },
      },
    ],
  },
  devtool: isMaster ? "" : "inline-source-map",
  devServer: {
    // redirect vue-router history
    historyApiFallback: {
      rewrites: [
        {
          from: /^\/$/,
          to: "/index.html",
        },
      ],
      disableDotRule: true,
    },
    host: "127.0.0.1",
    hot: true,
    port: 8088,
    publicPath: PUBLIC_PATH,
    disableHostCheck: true,
    contentBase: [path.join(__dirname, "dist")], // 读取静态资源
  },
  optimization: {
    splitChunks: {
      // initial、async、 all。
      // 默认为async，表示只会提取异步加载模块的公共代码，initial表示只会提取初始入口模块的公共代码，all表示同时提取前两者的代码
      chunks: "async",
      // minSize: 30000, //模块大于30k会被抽离到公共模块
      // minChunks: 1, //模块出现1次就会被抽离到公共模块
      // maxAsyncRequests: 5, //异步模块，一次最多只能被加载5个
      // maxInitialRequests: 3, //入口模块最多只能加载3个
      cacheGroups: {
        commons: {
          name: "commons",
          chunks: "initial",
          minChunks: 2,
        },
      },
    },
  },
  resolve: {
    // 配置模块如何解析
    extensions: [".vue", ".ts", ".tsx", ".js", ".jsx", ".json"],
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      SITE_INFO: JSON.stringify(SITE_INFO),
      PUBLIC_PATH: JSON.stringify(PUBLIC_PATH),
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
    extractLESS,
    extractSCSS,
    //压缩提取出的css，并解决ExtractTextPlugin分离出的js重复问题(多个文件引入同一css文件)
    new OptimizeCSSPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html", // 生成的html文件名
      template: "./src/app/index.html", // 依据的模板
      inject: true, //注入的js文件将会被放在body标签中,当值为'head'时，将被放在head标签中
      minify: {
        //压缩配置
        removeComments: true, //删除html中的注释代码
        collapseWhitespace: true, //删除html中的空白符
        removeAttributeQuotes: true, //删除html元素中属性的引号
      },
      // chunksSortMode: "dependency" //按dependency的顺序引入
      chunksSortMode: "none", //如果使用webpack4将该配置项设置为'none'
    }),
  ],
};
