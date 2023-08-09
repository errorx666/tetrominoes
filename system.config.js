SystemJS.config( {
	paths: {
		'npm:*': 'lib/*',
	},
	map: {
		app: 'js',
		tslib: 'npm:tslib/tslib.js'
	},
	packages: {
		app: {
			main: 'main.js',
			defaultExtension: 'js'
		}
	}
} );
