var webpack = require('webpack');
var AssetsPlugin = require('assets-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin'); // 清理文件夹
var path = require('path');

var ROOT_PATH = path.resolve(__dirname); // 项目根路径
var BUILD_PATH = path.resolve(ROOT_PATH, '../public/tmp'); // 发布文件所存放的目录

module.exports = {
    entry: {
        bundle: [
            'react',
            'react-dom',
            'react-router',
            'redux',
            'redux-thunk',
            'immutable',
            'antd',
            'echarts',
            'html2canvas',
            'jspdf',
            'pure-render-decorator',
            'marked',
            'react-slick',
            'react-pdf',
            'babel-plugin-import',
            'copy-to-clipboard'
        ],
    },
    output: {
        publicPath: '/tmp/',
        path:  BUILD_PATH,
        filename: '[name].[chunkhash].js',
        library: '[name]_library'
    },
    plugins: [
        new CleanWebpackPlugin(['tmp'], {
          root: path.resolve(ROOT_PATH, '../public'),
          verbose: true,
          dry: false
        }),
        new webpack.DllPlugin({
            path: BUILD_PATH + '/bundle.manifest.json',
            name: '[name]_library',
        }),
       new AssetsPlugin({
        	filename: 'bundle-config.json', 
        	path: BUILD_PATH,
        }),
    ]
};