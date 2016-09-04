'use strict';

const gulp = require('gulp');
const chalk = require('chalk');
const template = require('gulp-template');
const conflict = require('gulp-conflict');

const installCNAME = function (options) {
  const answers = options.answers;
  const srcDir = options.srcDir;
  const destDir = options.destDir;
  const templateSettings = options.templateSettings;

  return function (cb) {
    console.log(chalk.blue('--Installing CNAME--'));
    gulp.src('CNAME', {cwd: srcDir, base: srcDir})
      .pipe(template(answers, templateSettings))
      .pipe(conflict(destDir, {logger: console.log}))
      .pipe(gulp.dest(destDir))
      .on('end', cb);
  };
};

module.exports = installCNAME;
