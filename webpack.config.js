import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
const dirname = path.resolve( '.' );

/** @returns {webpack.Configuration} */
export default async function getConfig( env ) {
	const loaders = {
		typescript: { loader: 'ts-loader', options: {} }
	};
	return {
		devtool: 'source-map',
		entry: {
			index: [ path.resolve( dirname, 'src', 'main' ) ]
		},
		mode: env.production ? 'production' : 'development',
		module: {
			rules: [
				{ test: /\.ts$/i, use: [ loaders.typescript ] }
			]
		},
		plugins: [
			new HtmlWebpackPlugin( {} )
		],
		resolve: {
			extensions: [ '.ts', '.js' ]
		}
	};
}
