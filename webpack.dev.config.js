const webpack = require('webpack');
const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const loaders = require('./webpack.loaders');

module.exports = {
	entry: {
		main: './src/index.js',
		three: './src/three/app.js',
	},
	output: {
		path: path.resolve(__dirname, 'public/'),
		publicPath: '/',
		filename: './js/[name].[hash].bundle.js',
	},
	module: {
		loaders,
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(), // Enable HMR
		new webpack.NamedModulesPlugin(),
		new BrowserSyncPlugin(
			{
				host: 'localhost',
				port: 3001,
				proxy: 'http://localhost:8080/',
				files: [
					{
						match: ['**/*.html'],
						fn: (event) => {
							if (event === 'change') {
								const bs = require('browser-sync').get('bs-webpack-plugin');
								bs.reload();
							}
						},
					},
				],
			},
			{
				reload: false,
			},
		),
		new HtmlWebpackPlugin({
			template: './src/template.html',
			files: {
				js: ['bundle.js'],
			},
			filename: 'index.html',
		}),
	],
	devServer: {
		hot: true, // Tell the dev-server we're using HMR
		contentBase: path.resolve(__dirname, 'public'),
		publicPath: '/',
	},
	watch: true,
	devtool: 'cheap-eval-source-map',
};
