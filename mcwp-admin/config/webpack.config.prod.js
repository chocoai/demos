'use strict';

const autoprefixer = require('autoprefixer'); // 自动添加兼容前缀插件
const path = require('path'); // node内置path模块
const webpack = require('webpack'); // webpack打包工具
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 动态打包的输出注入到页面中
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // css单独打包
const ManifestPlugin = require('webpack-manifest-plugin'); // 生成一个包含所有资源文件名映射的清单文件
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin'); // 将自定义变量插入到index.html
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');     // 360s ==> 210s
const os = require('os');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length});
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin'); // 用于使用service worker来缓存外部项目依赖项
// const eslintFormatter = require('react-dev-utils/eslintFormatter'); // 自定义 ESLint 格式化程序
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin'); // 模块
const paths = require('./paths'); // 路径
const getClientEnvironment = require('./env');
// const bundleConfig = require("../mcwpadmin/dist/bundle-config.json");

/**
 * 在生成的html中，文件的引入路径会相对于此地址，生成的css中，以及各类图片的URL都会相对于此地址
 * 因为打包后的所有文件，是要交给后台程序员，然后跟后台程序一起，组装成一个完整的项目，上线后，
 * 肯定有一个网址来访问，比如: www.test.com; 那么前端代码中所有的URL地址，都是相对于这个网址而言的，
 * 所以这里配置publicPath为‘/’,比如首页的路径就是www.test.com/home,图片test.jpg的访问路径就是
 * www.test.com/images/test.jpg，最关键的是路由跳转，我们之后要配置react路由，比如这里配置的
 * publicPath是‘/’,那路由中route访问主页，就应该配置为：
 * <Route path="/home" component={homeContainer} /> 又比如publicPath配置的是'/xxx', route就应该是：
 * <Route path="/xxx/home" component={homeContainer} />。一般就配置为'/',因为一个项目上线后就会
 * 有一个顶级域名指向它，但我们自己测试的时候，比如你最终打包了，然后把代码放到tomcat中运行，tomcat访问
 * 肯定就是:http://localhost:8888/myreact,这不是顶级域名，你就应该配置publicPath为‘/myreact’,
 * 路由中也相应配置为/myreact/home  
 */
const publicPath = paths.servedPath; // conosle.log：'/'

// 相对路径
const shouldUseRelativeAssetPaths = publicPath === './'; // conosle.log：false

// 有些资源很大, 可能会导致内存不足问题。 更换打包方式
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
const publicUrl = publicPath.slice(0, -1);

// 获取环境变量
const env = getClientEnvironment(publicUrl);
// 确定环境
if (env.stringified['process.env'].NODE_ENV !== '"production_test"' && env.stringified['process.env'].NODE_ENV !== '"production_advance"' && env.stringified['process.env'].NODE_ENV !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

// css文件
const cssFilename = 'static/css/[name].[contenthash:8].css';

// ExtractTextPlugin expects the build output to be flat.
// (See https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/27)
// However, our output is structured with css, js and media folders.
// To have this structure working with relative paths, we have to use custom options.
const extractTextPluginOptions = shouldUseRelativeAssetPaths
  ? // Making sure that the publicPath goes back to to build folder.
    { publicPath: Array(cssFilename.split('/').length).join('../') }
  : {};
// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = {
  // 有错误，终端
  bail: true,
  // We generate sourcemaps in production. This is slow but gives good results.
  // You can exclude the *.map files from the build during deployment.
  devtool: shouldUseSourceMap ? 'source-map' : false,
  // devtool: 'source-map',
  // In production, we only want to load the polyfills and the app code.
  entry: [require.resolve('./polyfills'), paths.appIndexJsx],
  output: {
    path: paths.appBuild, // 将文件打包到此目录下
    filename: 'static/js/[name].[chunkhash:8].js', // 最终生成的 JS 文件名 (带有嵌套的文件夹)，项目中为App.jsx,最终生成App.js。有一个主包, 其余每个异步块的一个文件
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    // We inferred the "public path" (such as / or /my-project) from homepage.
    publicPath: publicPath,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path
        .relative(paths.appSrc, info.absoluteResourcePath)
        .replace(/\\/g, '/'),
  },
  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    modules: ['node_modules', paths.appNodeModules].concat(
      // It is guaranteed to exist because we tweak it in `env.js`
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
    // `web` extension prefixes have been added for better support
    // for React Native Web.
    extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx'],
    alias: {
      // @remove-on-eject-begin
      // Resolve Babel runtime relative to react-scripts.
      // It usually still works on npm 3 without this but it would be
      // unfortunate to rely on, as react-scripts could be symlinked,
      // and thus babel-runtime might not be resolvable from the source.
      'babel-runtime': path.dirname(
        require.resolve('babel-runtime/package.json')
      ),
      // @remove-on-eject-end
      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      'react-native': 'react-native-web',
    },
    plugins: [
      // Prevents users from importing files from outside of src/ (or node_modules/).
      // This often causes confusion because we only process files within src/ with babel.
      // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
      // please link the files into your node_modules/ and let module-resolution kick in.
      // Make sure your source files are compiled, as they will not be processed in any way.
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      // TODO: Disable require.ensure as it's not a standard language feature.
      // We are waiting for https://github.com/facebookincubator/create-react-app/issues/2176.
      // { parser: { requireEnsure: false } },

      // First, run the linter.
      // It's important to do this before Babel processes the JS.
    //   {
    //     test: /\.(js|jsx)$/,
    //     enforce: 'pre',
    //     use: [
    //       {
    //         options: {
    //           formatter: eslintFormatter,
    //           eslintPath: require.resolve('eslint'),
    //           // @remove-on-eject-begin
    //           // TODO: consider separate config for production,
    //           // e.g. to enable no-console and no-debugger only in production.
    //           baseConfig: {
    //             extends: [require.resolve('eslint-config-react-app')],
    //           },
    //           ignore: false,
    //           useEslintrc: false,
    //           // @remove-on-eject-end
    //         },
    //         loader: require.resolve('eslint-loader'),
    //       },
    //     ],
    //     include: paths.appSrc,
    //     exclude: paths.noEslint,
    //   },
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // "url" loader works just like "file" loader but it also embeds
          // assets smaller than specified size as data URLs to avoid requests.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            exclude: /node_modules/,
            // loader: 'happypack/loader?id=url'
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          // Process JS with Babel.
          {
            test: /\.(js|jsx)$/,
            include: paths.appSrc,
            exclude: /node_modules|ueditor/,
            loader: 'happypack/loader?id=js'
            // loader: require.resolve('babel-loader'),
            // options: {
            //   plugins: [
            //     ['import', { libraryName: 'antd', style: 'css' }],
            //       // ['import', [{ libraryName: 'antd', style: true }]],  // import less
            //   ]
            // }
          },
          // The notation here is somewhat confusing.
          // "postcss" loader applies autoprefixer to our CSS.
          // "css" loader resolves paths in CSS and adds assets as dependencies.
          // "style" loader normally turns CSS into JS modules injecting <style>,
          // but unlike in development configuration, we do something different.
          // `ExtractTextPlugin` first applies the "postcss" and "css" loaders
          // (second argument), then grabs the result CSS and puts it into a
          // separate file in our build process. This way we actually ship
          // a single CSS file in production instead of JS code injecting <style>
          // tags. If you use code splitting, however, any async bundles will still
          // use the "style" loader inside the async code so CSS from them won't be
          // in the main CSS file.
          {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract(
              Object.assign(
                {
                  fallback: require.resolve('style-loader'),
                  use: [
                    {
                      loader: 'happypack/loader?id=css'
                      // loader: require.resolve('css-loader'),
                      // options: {
                      //   importLoaders: 1,
                      //   minimize: true,
                      //   sourceMap: shouldUseSourceMap,
                      // }
                    },
                    {
                      // loader: 'happypack/loader?id=postcss',
                      loader: require.resolve('postcss-loader'),
                      options: {
                        // Necessary for external CSS imports to work
                        // https://github.com/facebookincubator/create-react-app/issues/2677
                        ident: 'postcss',
                        plugins: () => [
                          require('postcss-flexbugs-fixes'),
                          autoprefixer({
                            browsers: [
                              '>1%',
                              'last 4 versions',
                              'Firefox ESR',
                              'not ie < 9', // React doesn't support IE8 anyway
                            ],
                            flexbox: 'no-2009',
                          }),
                        ],
                      }
                    },
                  ],
                },
                extractTextPluginOptions
              )
            ),
            // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
          },
          // "file" loader makes sure assets end up in the `build` folder.
          // When you `import` an asset, you get its filename.
          // This loader don't uses a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            loader: require.resolve('file-loader'),
            // Exclude `js` files to keep "css" loader working as it injects
            // it's runtime that would otherwise processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [
                /\.html$/,
                /\.(js|jsx)$/,
                /\.css$/,
                  /\.less$/,
                /\.json$/,
                /\.bmp$/,
                /\.gif$/,
                /\.jpe?g$/,
                /\.png$/,
            ],
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          // Parse less files and modify variables
        {
            test: /\.less$/,
            use: [
                require.resolve('style-loader'),
                require.resolve('css-loader'),
                {
                    // loader: 'happypack/loader?id=postcss',
                    loader: require.resolve('postcss-loader'),
                    options: {
                        ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
                        plugins: () => [
                            require('postcss-flexbugs-fixes'),
                            autoprefixer({
                                browsers: [
                                    '>1%',
                                    'last 4 versions',
                                    'Firefox ESR',
                                    'not ie < 9', // React doesn't support IE8 anyway
                                ],
                                flexbox: 'no-2009',
                            }),
                        ],
                    }
                },
                {
                    loader: require.resolve('less-loader'),
                    options: {
                        // modifyVars: { "@primary-color": "#1DA57A" },
                    },
                },
            ],
        },
          // ** STOP ** Are you adding a new loader?
          // Make sure to add the new loader(s) before the "file" loader.
        ],
      },
    ],
  },
  plugins: [
    // Makes some environment variables available in index.html.
    // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In production, it will be an empty string unless you specify "homepage"
    // in `package.json`, in which case it will be the pathname of that URL.
    new InterpolateHtmlPlugin(env.raw),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      // bundleName: bundleConfig.bundle.js,
      // favicon: paths.appFavicon,
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
    }),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
    // It is absolutely essential that NODE_ENV was set to production here.
    // Otherwise React will be compiled in the very slow development mode.
    new webpack.DefinePlugin(env.stringified),
    // Minify the code.
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false,
    //     // Disabled because of an issue with Uglify breaking seemingly valid code:
    //     // https://github.com/facebookincubator/create-react-app/issues/2376
    //     // Pending further investigation:
    //     // https://github.com/mishoo/UglifyJS2/issues/2011
    //     comparisons: false,
    //   },
    //   output: {
    //     comments: false,
    //     // Turned on because emoji and regex is not minified properly using default
    //     // https://github.com/facebookincubator/create-react-app/issues/2488
    //     ascii_only: true,
    //   },
    //   sourceMap: shouldUseSourceMap,
    // }),
    new webpack.optimize.CommonsChunkPlugin({
        children: true,
        // (选择所有被选 chunks 的子 chunks)
        minChunks: 3,
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
    new HappyPack({
        id: 'js',
        threadPool: happyThreadPool,
        verboseWhenProfiling:true,
        verbose: process.env.HAPPY_VERBOSE === '1',
        loaders: [{
          loader: require.resolve('babel-loader'),
            options: {
              plugins: [
                ['import', { libraryName: 'antd', style: 'css' }],
                  // ['import', [{ libraryName: 'antd', style: true }]],  // import less
              ]
            }
        }]
    }),
    new HappyPack({
        id: 'css',
        threadPool: happyThreadPool,
        verboseWhenProfiling:true,
        verbose: process.env.HAPPY_VERBOSE === '1',
        loaders: [{
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              minimize: true,
              sourceMap: shouldUseSourceMap,
            }
        }]
    }),
    new HappyPack({
        id: 'url',
        threadPool: happyThreadPool,
        verboseWhenProfiling:true,
        verbose: process.env.HAPPY_VERBOSE === '1',
        loaders: [{
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            }
        }]
    }),
    new HappyPack({
        id: 'postcss',
        threadPool: happyThreadPool,
        verboseWhenProfiling:true,
        verbose: process.env.HAPPY_VERBOSE === '1',
        loaders: [{
            loader: require.resolve('postcss-loader'),
        }]
    }),
    // new webpack.DllReferencePlugin({
    //     manifest: require('../mcwpadmin/dist/bundle.manifest.json')
    // }),
    // Uglify 加密压缩源代码
    new ParallelUglifyPlugin({
        // include: [APP_PATH, BUILD_PATH],
        workerCount: os.cpus().length,
        uglifyJS:{
            output: {
                comments: false, // 删除代码中所有注释
                max_line_len: 50000
            },
            compress: {
                warnings: false, // 忽略警告
                drop_debugger: true,
                drop_console: true
            }
        }
    }),
    // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
    new ExtractTextPlugin({
      filename: cssFilename,
    }),
    // 生成一个包含所有资源文件名映射的清单文件，用于index.html资源引入
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
    }),
    // Generate a service worker script that will precache, and keep up to date,
    // the HTML & assets that are part of the Webpack build.
    new SWPrecacheWebpackPlugin({
      // By default, a cache-busting query parameter is appended to requests
      // used to populate the caches, to ensure the responses are fresh.
      // If a URL is already hashed by Webpack, then there is no concern
      // about it being stale, and the cache-busting can be skipped.
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'service-worker.js',
      logger(message) {
        if (message.indexOf('Total precache size is') === 0) {
          // This message occurs for every build and is a bit too noisy.
          return;
        }
        if (message.indexOf('Skipping static resource') === 0) {
          // This message obscures real errors so we ignore it.
          // https://github.com/facebookincubator/create-react-app/issues/2612
          return;
        }
        console.log(message);
      },
      minify: true,
      // For unknown URLs, fallback to the index page
      navigateFallback: publicUrl + '/index.html',
      // Ignores URLs starting from /__ (useful for Firebase):
      // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
      navigateFallbackWhitelist: [/^(?!\/__).*/],
      // Don't precache sourcemaps (they're large) and build asset manifest:
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    }),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/, /Ueditor\/ueditor/),
  ],
  // 有些导入的node模块, 但不在浏览器中使用它们，告诉 Webpack 为他们提供空的模拟, 以便导入它们的工作
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
};