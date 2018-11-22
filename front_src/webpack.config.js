const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack');
// const fs = require('fs');


// function generateHtmlPlugins (templateDir) {
//   // Read files in template directory
//   const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir))
//   return templateFiles.map(item => {
//     // Split names and extension
//     const parts = item.split('.')
//     const name = parts[0]
//     const extension = parts[1]
//     // Create new HTMLWebpackPlugin with options
//     return new HtmlWebPackPlugin({
//       filename: `${name}.html`,
//       template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`)
//     })
//   })
// }

// const htmlPlugins = generateHtmlPlugins('./views/')



module.exports = (env, argv) =>  {
  console.log('CURRENT MODE: ', argv.mode);

  return {
    entry: {
      main: [
        './views/main/main.js',
      ],
      about: [
        './views/about/main.js',
      ],
      index: [
        './main.js',
      ],
    },
    output: {
      path: path.resolve(__dirname, '../htdocs'),
      filename: (chunkData) => {
        return chunkData.chunk.name === 'index' ? '[name].js': '[name]/[name].js';
      },
    },
    module: {
      rules: [
        {
          test: /\.glsl$/,
          loader: 'webpack-glsl-loader',
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.pug$/,
          use: [
            {
              loader: "pug-loader",
              options: { minimize: true }
            }
          ]
        },
        {
          test: /\.styl$/,
          use:argv.mode === 'development'
          ? ['style-loader', 'css-loader', 'stylus-loader']
          : [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader'],
        },
        {
          test: /\.svg$/,
          loader: 'svg-inline-loader'
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            'file-loader',
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf|obj|mp4)$/,
          use: [
            'file-loader',
          ]
        },
      ]
    },
    plugins: argv.mode === 'development' ? [
      new HtmlWebPackPlugin({
        chunks: ['index'],
        template: "./index.pug",
        filename: "./index.html"
      }),
      new HtmlWebPackPlugin({
        chunks: ['main'],
        template: "./views/main/index.pug",
        filename: "./main/index.html"
      }),
      new HtmlWebPackPlugin({
        chunks: ['about'],  
        template: "./views/about/index.pug",
        filename: "./about/index.html"
      }),
      new MiniCssExtractPlugin({
        filename: "[name]/[name].css",
        chunkFilename: "[name]/[id].css"
      }),
      // Если хочешь THREE.js на проекте - раскоменти.

      // new webpack.ProvidePlugin({
      //   THREE: "three"
      // }),
    ] : [
      new HtmlWebPackPlugin({
        chunks: ['index'],
        template: "./index.pug",
        filename: "./index.html"
      }),
      new HtmlWebPackPlugin({
        chunks: ['main'],
        template: "./main/index.pug",
        filename: "./main/index.html"
      }),
      new HtmlWebPackPlugin({
        chunks: ['about'],  
        template: "./about/index.pug",
        filename: "./about/index.html"
      }),
      new MiniCssExtractPlugin({
        filename: "[name]/[name].css",
        chunkFilename: "[name]/[id].css"
      }),
      new CleanWebpackPlugin(
        path.resolve(__dirname, '../htdocs'), {allowExternal: true}
      ),

      // Если хочешь THREE.js на проекте - раскоменти.

      // new webpack.ProvidePlugin({
      //   THREE: "three"
      // }),
    ],
    devServer: {
      host: '0.0.0.0'
    },
    resolve: {
      alias: {
        components: path.resolve(__dirname, './components'),
        assets: path.resolve(__dirname, './assets'),
        libs: path.resolve(__dirname, './libs'),
      }
    }
  }
};