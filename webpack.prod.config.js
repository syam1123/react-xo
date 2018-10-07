const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OfflinePlugin = require('offline-plugin');

const __DEV__ = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: [
    'babel-polyfill',
    './src/index.js',
  ],

  output: {
    path: path.resolve(process.cwd(), 'build-prod'),
    publicPath: '/',
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
  },

  // devtool: 'cheap-module-source-map',

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.js?$/,
        use: [
          'babel-loader',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(eot|svg|ttf|otf|woff|woff2)$/,
        loader: 'file-loader'
      },
      {
        test: /\.(jpg|png|gif)$/,
        loaders: [
          'file-loader',
          {
            loader: 'image-webpack-loader'
          }
        ],
      }
    ]
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      output: {
        ascii_only: true,
        comments: false
      },
      compress: {
        unused: true,
        dead_code: true, // big one--strip code that will never execute
        warnings: false, // good for prod apps so users can't peek behind curtain
        drop_debugger: true,
        conditionals: true,
        evaluate: true,
        drop_console: true, // strips console statements
        sequences: true,
        booleans: true,
      }
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
        inject: true,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      },
    }),
    new webpack.NamedModulesPlugin(),
    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    //
    new OfflinePlugin({
      publicPath: '/',
      caches: {
        main: [
          'vendor.*.js',
          '*.js',
          '**.*.js',
          '*.png',
          '*.otf'
        ]
      },
      responseStrategy: 'cache-first',
      ServiceWorker: {
        navigateFallbackURL: '/',
        cacheName: 'syam-pillai-main' // do not change this. It will leave the old cache in browser for ever
      },
      AppCache: {
        FALLBACK: {
          '/': '/offline-page.html'
        }
      }
    })

  ],

  resolve: {
    modules: ['src', 'node_modules'],
    extensions: [
      '.js',
      '.jsx',
      '.react.js',
    ],
    mainFields: [
      'browser',
      'jsnext:main',
      'main',
    ],
  },
};
