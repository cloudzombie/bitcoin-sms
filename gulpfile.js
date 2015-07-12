'use strict';

var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    minifyCSS = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    postCss = require('gulp-postcss'),
    gutil = require('gulp-util'),
    nodemon = require('gulp-nodemon'),
    browserSync = require('browser-sync'),

    secrets = require('./lib/secrets/secrets'),
    constants = require('./lib/constants/constants'),
    port = process.env.PORT || constants.port,


    paths = {
        staticDir: 'public/app',
        srcStyles: 'public/app/styles',
        views: 'views'
    },

    sassOpts = {style: 'expanded'},
    minifyCSSOpts = {compatibility: 'ie8'},

    errorHandler = function (culprit) {
        return function (err) {
            gutil.log(gutil.colors.red('[ ' + culprit + ' ]'), err.toString());
        }
    };


gulp.task('styles', function () {
    return gulp.src(paths.srcStyles + '/**/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass(sassOpts).on('error', errorHandler('Sass')))
        .pipe(postCss([
            require('autoprefixer-core')({browsers: 'last 1 version'})
        ]))
        .pipe(minifyCSS(minifyCSSOpts))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.srcStyles + '/'));
});

gulp.task('nodemon', ['styles'], function (cb) {

    var started = false;
    return nodemon({
        script: 'index.js',
        ext: 'html js',
        env: {
            'STRIPE__PUBLIC_KEY': secrets.STRIPE__PUBLIC_KEY,
            'STRIPE__SECRET_KEY': secrets.STRIPE__SECRET_KEY,
            'TWILIO__AUTH_TOKEN': secrets.TWILIO__AUTH_TOKEN,
            'TWILIO__ACCOUNT_SID': secrets.TWILIO__ACCOUNT_SID,
            'STORMPATH__REST_URL': secrets.STORMPATH__REST_URL
        }
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        if (!started) {
            cb();
            started = true;
        }
    });
});

gulp.task('watch', function () {
    gulp.watch([paths.views + '/**/*.hbs']).on('change', browserSync.reload);
    gulp.watch([paths.srcStyles + '/**/*.scss'], ['styles']);
});

gulp.task('serve', ['nodemon', 'watch'], function () {

    return browserSync.init(null, {
        proxy: 'http://localhost:' + port,
        files: [paths.staticDir + '/**/*.*'],
        browser: 'google chrome',
        port: 7000
    });
});




//gulp.task('default', function () {
//    gulp.start('build');
//});
