import path from 'path';
import webpack from 'webpack';
import express from 'express';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const dirname = path.resolve( '.' );

/** @returns {webpack.Configuration} */
export default async function getConfig( env ) {
	const loaders = {
		typescript: { loader: 'ts-loader', options: {} }
	};
	return {
		context: path.resolve( 'src' ),
		devtool: 'source-map',
		devServer: {
			onListening: devServer => {
				let leaderboard = [
					{ name: 'Alice', score: 200, lines: 2, time: 10 },
					{ name: 'Bob', score: 100, lines: 1, time: 10 }
				];
				devServer.app.use( express.json() );
				devServer.app.post( '/leaderboard.php', ( req, res ) => {
					if( req.body?.name ) {
						leaderboard = [ ...leaderboard, req.body ].sort( ( a, b ) => b.score - a.score ).slice( 0, 10 );
					}
					res.json( leaderboard );
				} );
			}
		},
		entry: {
			index: [ path.resolve( dirname, 'src', 'main' ) ]
		},
		mode: env.production ? 'production' : 'development',
		module: {
			rules: [
				{ test: /\.ts$/i, use: [ loaders.typescript ] }
			]
		},
		output: {
			path: path.resolve( dirname, 'dist' )
		},
		plugins: [
			new HtmlWebpackPlugin( {
				title: 'Tetrmoninoes'
			} ),
			new CopyWebpackPlugin( {
				patterns: [ { from: '**/*.php', to: '.' } ]
			} )
		],
		resolve: {
			extensions: [ '.ts', '.js' ]
		}
	};
}
