'use strict';

const gulp = require('gulp');
const chalk = require('chalk');
const rename = require('gulp-rename');
const template = require('gulp-template');
const conflict = require('gulp-conflict');

const installStylesheetFiles = function (options) {
  const answers = options.answers;
  const src = options.src;
  const srcDir = options.srcDir;
  const destDir = options.destDir;
  const templateSettings = options.templateSettings;

  return function (cb) {
    console.log(chalk.blue('--Installing stylesheets--'));
    gulp.src(src, {cwd: srcDir, base: srcDir})
      .pipe(template(answers, templateSettings))
      .pipe(rename(filepath => {
        filepath.dirname = filepath.dirname.replace(`/${answers.framework}`, '');
        return;
      }))
      .pipe(conflict(destDir, {logger: console.log}))
      .pipe(gulp.dest(destDir))
      .on('end', cb);
  };
};

module.exports = installStylesheetFiles;
