'use strict';

const gulp = require('gulp');
const conflict = require('gulp-conflict');
const chalk = require('chalk');

const copyFiles = function (options) {
  const src = options.src;
  const srcDir = options.srcDir;
  const destDir = options.destDir;

  return function (cb) {
    console.log(chalk.blue('--Copying theme files--'));
    gulp.src(src, {dot: true, cwd: srcDir, base: srcDir})
      .pipe(conflict(destDir, {logger: console.log}))
      .pipe(gulp.dest(destDir))
      .on('end', cb);
  };
};

module.exports = copyFiles;
