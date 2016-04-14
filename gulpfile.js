var gulp = require('gulp'),
	nodemon = require('gulp-nodemon');

var nodemonIgnores = [
	'lib/**/*',
	'node_modules/**/*'
];

gulp.task('nodemon', function (callback) {
	var started = false;
	nodemon({script: 'main.js', ignore: nodemonIgnores}).on('start', function () {
		if (!started) { callback(); started = true; }
	});
});

gulp.task('default', ['nodemon']);