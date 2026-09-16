const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const env = dotenv.config().parsed || {};

module.exports = (webpackEnv, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: isProduction ? "production" : "development",

    entry: "./src/index.jsx",

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProduction ? "[name].[contenthash].js" : "bundle.js",
      chunkFilename: isProduction ? "[name].[contenthash].js" : "[name].js",
      clean: true,
    },

    devtool: isProduction ? "source-map" : "eval-source-map",

    resolve: {
      extensions: [".js", ".jsx"],
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
      new webpack.DefinePlugin({
        "process.env.FAKEQL_ENDPOINT": JSON.stringify(env.FAKEQL_ENDPOINT),
      }),
    ],

    optimization: isProduction
      ? {
          minimize: true,
          splitChunks: {
            chunks: "all",
          },
          runtimeChunk: "single",
        }
      : {},

    performance: {
      maxAssetSize: 512000,
      maxEntrypointSize: 512000,
    },

    devServer: {
      static: {
        directory: path.join(__dirname, "public"),
      },
      port: 3000,
      open: true,
      hot: true,
      historyApiFallback: true,
    },
  };
};
