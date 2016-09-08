'use strict';

const gulp = require('gulp');
const template = require('gulp-template');
const conflict = require('gulp-conflict');

const installCNAME = function (options) {
  const answers = options.answers;
  const srcDir = options.srcDir;
  const destDir = options.destDir;
  const templateSettings = options.templateSettings;

  return function (cb) {
    gulp.src('CNAME', {cwd: srcDir, base: srcDir})
      .pipe(template(answers, templateSettings))
      .pipe(conflict(destDir, {logger: console.log}))
      .pipe(gulp.dest(destDir))
      .on('end', cb);
  };
};

module.exports = installCNAME;
