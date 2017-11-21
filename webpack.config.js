const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'jshint-loader'
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				loader: ['style-loader','css-loader']
			},
			{
				test: /\.html$/,
				exclude: /node_modules/,
				loader: 'html-loader'
			},
			{
				test: /\.png$/,
				exclude: /node_modules/,
				use: ['url-loader?mimetype=image/png']
			}
		]
	},
	plugins: [
		new CopyWebpackPlugin([
			{ from: './src/index.html' },
			{ from: 'node_modules/bootstrap/dist/css/bootstrap.css'}
		])
	],
	devServer: {
		contentBase: path.join(__dirname, 'dist')
	},
	resolve: {
		alias: {
			'handlebars': 'handlebars/dist/handlebars.min.js'
		}
	}
};













