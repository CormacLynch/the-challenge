'use strict'

var webpack = require('webpack/lib/webpack');
var merge = require('webpack-merge');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

const PATH = (str) => path.resolve(__dirname, str)
const NPM_EVENT = process.env.npm_lifecycle_event

const PluginDefineEnv = (env) => new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(env) })

const commonWebpackPlugins = [
	new ExtractTextPlugin('../css/style.css')
]

const webpackConfig = {
	entry: {
		index: ['./js/index.js']
	},
	output: {
		path: path.resolve('js/'),
		filename: 'bundle-[name].js',
		sourceMapFilename: '[file].map'
	},
	module: {
		loaders: [
			{
				test: /\.js$|\.json$|\.jsx$/,
				loader: 'babel-loader',
				include: path.resolve('js/'),
				exclude: path.resolve(__dirname, 'node_modules')
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('css-loader?module!autoprefixer-loader')
			},
			{
				test: /\.less$/,
				loader: ExtractTextPlugin.extract('css-loader!less-loader')
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				loader: 'file?name=../fonts/[name].[ext]'
			}
		]
	}
}

if (NPM_EVENT === 'prod') {
	module.exports = merge(webpackConfig, {
		preLoaders: [
			{
				test: /\.js$/,
				loaders: ['eslint'],
				include: path.resolve('js/'),
				exclude: path.resolve(__dirname, 'node_modules')
			}
		],
		devtool: 'source-map',
		plugins: [
			...commonWebpackPlugins,
			PluginDefineEnv('production'),
			new webpack.optimize.DedupePlugin(),
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false
				}
			}),
		]
	})
}

if (NPM_EVENT !== 'prod') {
	module.exports = merge(webpackConfig, {
		devtool: 'inline-source-map',
		plugins: [
			...commonWebpackPlugins,
			PluginDefineEnv('development')
		]
	})
}

