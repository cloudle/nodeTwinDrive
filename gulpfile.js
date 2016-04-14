var gulp = require('gulp'),
	babel = require('gulp-babel'),
	nodemon = require('gulp-nodemon');

var nodemonIgnores = [
	'lib/**/*',
	'node_modules/**/*'
];

gulp.task("build", function () {
	gulp.src("lib/*.js")
		.pipe(babel({}))
		.pipe(gulp.dest("dist"))
});

gulp.task('nodemon', function (callback) {
	var started = false;
	nodemon({script: 'main.js', ignore: nodemonIgnores}).on('start', function () {
		if (!started) { callback(); started = true; }
	});
});

gulp.task('default', ['nodemon']);