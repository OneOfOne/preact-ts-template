
const path = require('path'),
	webpack = require('webpack');


const babelTransformImports = {
	reactstrap: {
		// eslint-disable-next-line
		transform: 'reactstrap/lib/${member}',
		preventFullImport: true,
	},
	lodash: {
		// eslint-disable-next-line
		transform: 'lodash/${member}',
		preventFullImport: true,
	},
},

babelLoader = {
	test: /\.tsx?$/i,
	exclude: /node_modules/,
	use: {
		loader: 'babel-loader',
		options: {
			babelrc: false,
			cacheDirectory: '/tmp/.babel-cache',
			presets: [
				[
					'@babel/env',
					{
						targets: { browsers: 'last 2 versions', ie: 11, android: 6 },
						exclude: ['transform-regenerator', 'transform-async-to-generator', 'proposal-async-generator-functions'],
						useBuiltIns: 'usage',
						loose: true,
						modules: false,
					// debug: true,
					},
				],
				['@babel/react', { loose: true }],
				['@babel/typescript', { loose: true }],
			],
			plugins: [
				['transform-imports', babelTransformImports],
				['module:fast-async', { 'useRuntimeModule': true }],
				'@babel/transform-runtime',
			],
		},
	},
};

module.exports = (env, argv) => {
	const isProd = argv.mode === 'production';
	const isDevServer = path.basename(require.main.filename) === 'webpack-dev-server.js';

	return {
		mode: isProd ? 'production' : 'development',
		cache: true,

		entry: { main: './src/main.tsx' },

		output: {
			path: path.resolve(__dirname, 'dist/'),
			filename: 'js/[name].[hash].js',
			chunkFilename: 'js/[name].[chunkhash].js',
			publicPath: '/',
		},

		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.css', '.html'],

			modules: [
				'node_modules',
				path.resolve(__dirname, 'src/'),
			],

			symlinks: false,
		},

		module: {
			rules: [
				{ enforce: 'pre', test: /\.[tj]sx?$/, use: 'source-map-loader' },
				babelLoader,
			]
		},

		performance: { hints: false },

		stats: {
			children: false,
			modules: false,
		},

		devtool: isProd ? 'source-map' : 'cheap-eval-source-map',

		devServer: {
			overlay: {
				warnings: true,
				errors: true,
			},
			stats: 'errors-only',
			contentBase: './dist',
			compress: true,
			historyApiFallback: true,
			progress: true,
			inline: true,
			disableHostCheck: true,
			port: 9000,
		},
	}
};
