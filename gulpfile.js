const gulp = require('gulp')
const shell = require('gulp-shell')
const runSequence = require('run-sequence')
const rimraf = require('gulp-rimraf')

gulp.task('default', () =>
    runSequence('clean', 'babel-build', () => {
        console.log('BUILD complete.');
    }))

gulp.task('clean', () => gulp.src('./lib', { read: false }).pipe(rimraf()));

gulp.task('babel-build',
    shell.task('node node_modules/babel-cli/bin/babel.js ./src --out-dir ./lib --source-maps')
)

