import path from 'path';
import webpack from 'webpack';
import express from 'express';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const dirname = path.resolve( '.' );

/** @returns {webpack.Configuration} */
export default async function getConfig( env ) {
	const loaders = {
		typescript: { loader: 'ts-loader', options: {} }
	};
	return {
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
		plugins: [
			new HtmlWebpackPlugin( {
				title: 'Tetrmoninoes'
			} )
		],
		resolve: {
			extensions: [ '.ts', '.js' ]
		}
	};
}
