const gulp = require( 'gulp' ),
	del = require( 'del' ),
	browsersync = require( 'browser-sync' ).create(),
	sourcemaps = require( 'gulp-sourcemaps' ),
	typescript = require( 'gulp-typescript' );

gulp.task( 'clean:lib', () =>
	del( [ 'lib' ] )
);

gulp.task( 'clean:js', () =>
	del( [ 'js' ] )
);

gulp.task( 'clean', gulp.parallel( 'clean:lib', 'clean:js' ) );

gulp.task( 'build:js:ts', () => {
	const tsproj = typescript.createProject( 'tsconfig.json' );
	return tsproj.src()
		.pipe( sourcemaps.init() )
		.pipe( tsproj() )
		.pipe( sourcemaps.write( '.' ) )
		.pipe( gulp.dest( tsproj.options.outDir ) )
		.pipe( browsersync.stream() );
} );

gulp.task( 'build:lib:copy', () =>
	gulp.src( [
		'node_modules/systemjs/dist/**/*',
		'node_modules/tslib/tslib.js'
	], { base: 'node_modules'	} )
	.pipe( gulp.dest( 'lib' ) )
	.pipe( browsersync.stream() )
);

gulp.task( 'build:js', gulp.parallel( 'build:js:ts' ) );

gulp.task( 'build:lib', gulp.parallel( 'build:lib:copy' ) );

gulp.task( 'build', gulp.parallel( 'build:js', 'build:lib' ) );

gulp.task( 'watch:js:ts', () =>
	gulp.watch(
		[ 'tsconfig.json', 'ts/**/*' ],
		gulp.series( 'clean:js', 'build:js' )
	)
);

gulp.task( 'watch:static', () => {
	browsersync.watch( [ '*.html', 'system.config.js' ] )
	.on( 'change', browsersync.reload );
} );

gulp.task( 'watch:js', gulp.parallel( 'watch:js:ts' ) );

gulp.task( 'watch', gulp.parallel( 'watch:js', 'watch:static' ) );

gulp.task( 'webserver:browsersync', () => {
	browsersync.init( {
		server: {
			baseDir: '.'
		}
	} );
} );

gulp.task( 'webserver', gulp.parallel( 'watch', 'webserver:browsersync' ) );

gulp.task( 'default', gulp.series( 'clean', 'build' ) );
