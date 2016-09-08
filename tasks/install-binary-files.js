'use strict';

const gulp = require('gulp');
const ignore = require('gulp-ignore');
const istextorbinary = require('istextorbinary');
const conflict = require('gulp-conflict');

const installBinaryFiles = function (options) {
  const src = options.src;
  const srcDir = options.srcDir;
  const destDir = options.destDir;

  return function (cb) {
    gulp.src(src, {cwd: srcDir, base: srcDir})
      .pipe(ignore.include(file => istextorbinary.isBinarySync(file.basename, file.contents)))
      .pipe(conflict(destDir, {logger: console.log}))
      .pipe(gulp.dest(destDir))
      .on('end', cb);
  };
};

module.exports = installBinaryFiles;
