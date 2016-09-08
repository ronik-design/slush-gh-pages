'use strict';

const gulp = require('gulp');
const ignore = require('gulp-ignore');
const istextorbinary = require('istextorbinary');
const template = require('gulp-template');
const conflict = require('gulp-conflict');

const installTextFiles = function (options) {
  const answers = options.answers;
  const src = options.src;
  const srcDir = options.srcDir;
  const destDir = options.destDir;
  const templateSettings = options.templateSettings;

  return function (cb) {
    gulp.src(src, {cwd: srcDir, base: srcDir})
      .pipe(ignore.include(file => istextorbinary.isTextSync(file.basename, file.contents)))
      .pipe(template(answers, templateSettings))
      .pipe(conflict(destDir, {logger: console.log}))
      .pipe(gulp.dest(destDir))
      .on('end', cb);
  };
};

module.exports = installTextFiles;
