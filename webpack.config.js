const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

dotenv.config({ quiet: true });

module.exports = (env = {}, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: isProduction ? "production" : "development",

    entry: "./src/index.jsx",

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProduction ? "assets/js/[name].[contenthash:8].js" : "bundle.js",
      chunkFilename: isProduction ? "assets/js/[name].[contenthash:8].js" : "[name].js",
      clean: true,
    },

    devtool: isProduction ? "hidden-source-map" : "eval-source-map",

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
            options: {
              cacheDirectory: true,
              cacheCompression: false,
            },
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
        "process.env.FAKEQL_ENDPOINT": JSON.stringify(process.env.FAKEQL_ENDPOINT),
      }),
      ...(env.analyze
        ? [
            new BundleAnalyzerPlugin({
              analyzerMode: "static",
              openAnalyzer: false,
              reportFilename: "bundle-report.html",
            }),
          ]
        : []),
    ],

    optimization: isProduction
      ? {
          minimize: true,
          moduleIds: "deterministic",
          chunkIds: "deterministic",
          splitChunks: {
            chunks: "all",
            cacheGroups: {
              vendors: {
                test: /[\\/]node_modules[\\/]/,
                name: "vendors",
              },
            },
          },
          runtimeChunk: {
            name: "runtime",
          },
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
