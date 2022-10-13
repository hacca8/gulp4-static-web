const { src, dest, watch, series, parallel } = require('gulp');
const $ = require('gulp-load-plugins')({
  pattern: [
    'gulp-*',
    'autoprefixer',
    'browser-sync',
  ]
});
const sass = $.sass(require('sass'));

const srcPathList = {
  pug: './src/pug/**/*.pug',
  sass: './src/scss/**/*.scss',
  js: './src/js/**/*.js'
}
const publicPathList = {
  pug: './public/',
  sass: './public/css/',
  js: './public/js/',
  base: './public/'
}

const pugCompile = () => {
  return src(srcPathList.pug)
    .pipe($.plumber({ errorHandler: $.notify.onError("Error: <%= error.message %>") }))
    .pipe($.pug({ pretty: true }))
    .pipe(dest(publicPathList.pug));
}
const sassCompile = () => {
  return src(srcPathList.sass)
    .pipe($.plumber({ errorHandler: $.notify.onError("Error: <%= error.message %>") }))
    .pipe(sass.sync({ outputStyle: 'expanded' }))
    .pipe($.postcss([ $.autoprefixer() ]))
    .pipe(dest(publicPathList.sass));
}
const jsCompile = () => {
  return src(srcPathList.js)
    .pipe($.plumber({ errorHandler: $.notify.onError("Error: <%= error.message %>") }))
    .pipe(dest(publicPathList.js));
}
const bsReload = (done) => {
  $.browserSync.reload();
  done();
}
const bsFunc = () => {
  $.browserSync({
    server: {
      baseDir: publicPathList.base
    },
    reloadOnRestart: true
  });
}

const watchFileList = () => {
  watch(srcPathList.pug, series(pugCompile, bsReload));
  watch(srcPathList.sass, series(sassCompile, bsReload));
  watch(srcPathList.js, series(jsCompile, bsReload));
}

exports.default = series(
  parallel(pugCompile, sassCompile, jsCompile),
  parallel(watchFileList, bsFunc)
);
