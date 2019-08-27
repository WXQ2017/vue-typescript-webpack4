const path = require("path");
const webpack = require("webpack");
const OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin");
// webpack 4 MiniCssExtractPlugin 代替 ExtractTextPlugin
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const CopyWebpackPlugin = require("copy-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

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

const publicPath = "/";
module.exports = {
  // mode: process.env.NODE_ENV,
  entry: {
    app: ["./src/app/app.ts"],
  },
  output: {
    filename: "scripts/[name]_[hash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: publicPath,
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
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "awesome-typescript-loader",
            options: {
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
          process.env.NODE_ENV !== "production"
            ? "vue-style-loader"
            : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?/,
        use: [
          {
            loader: "url-loader",
            query: {
              limit: 10000,
              name: "img/[name].[hash:7].[ext]",
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        query: {
          limit: 10000,
          name: "fonts/[name].[hash:7].[ext]",
        },
      },
    ],
  },
  devtool: "inline-source-map",
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
    publicPath: publicPath,
  },
  optimization: {
    minimize: isMaster ? true : false, //是否进行代码压缩
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,

        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        },
      }),
    ],
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
    extensions: [".vue", ".js", ".ts", ".json"],
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      "process.env": process.env.NODE_ENV,
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
    // 分离公共js到vendor中
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "vendor", //文件名
    //   minChunks: (module, count) => {
    //     // 声明公共的模块来自node_modules文件夹
    //     return (
    //       module.resource && /\.js$/.test(module.resource) && module,
    //       resource.indexOf(path.join(__dirname, "../node_modules")) === 0
    //     );
    //   }
    // }),
    // //上面虽然已经分离了第三方库,每次修改编译都会改变vendor的hash值，导致浏览器缓存失效。原因是vendor包含了webpack在打包过程中会产生一些运行时代码，运行时代码中实际上保存了打包后的文件名。当修改业务代码时,业务代码的js文件的hash值必然会改变。一旦改变必然会导致vendor变化。vendor变化会导致其hash值变化。
    // //下面主要是将运行时代码提取到单独的manifest文件中，防止其影响vendor.js
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "mainifest",
    //   chunks: ["vendor"]
    // }),
    // 复制静态资源,将static文件内的内容复制到指定文件夹
    // new CopyWebpackPlugin([
    //   {
    //     from: path.resolve(__dirname, "../static"),
    //     to: "/static",
    //     ignore: [".*"] //忽视.*文件
    //   }
    // ])
  ],
};
