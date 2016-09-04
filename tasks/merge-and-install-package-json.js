'use strict';

const gulp = require('gulp');
const chalk = require('chalk');
const template = require('gulp-template');
const conflict = require('gulp-conflict');
const jeditor = require('gulp-json-editor');
const merge = require('lodash/merge');

const mergeAndInstallPackageJSON = function (options) {
  const answers = options.answers;
  const src = options.src;
  const srcDir = options.srcDir;
  const destDir = options.destDir;
  const templateSettings = options.templateSettings;
  const target = options.target;

  return function (cb) {
    console.log(chalk.blue('--Installing package.json--'));

    const pkgMerge = pkg => {
      if (target) {
        return merge(target, pkg);
      }
      return pkg;
    };

    gulp.src(src, {cwd: srcDir, base: srcDir})
      .pipe(template(answers, templateSettings))
      .pipe(jeditor(pkgMerge, {
        indent_char: ' ', // eslint-disable-line
        indent_size: 2 // eslint-disable-line
      }))
      .pipe(conflict(destDir, {logger: console.log}))
      .pipe(gulp.dest(destDir))
      .on('end', cb);
  };
};

module.exports = mergeAndInstallPackageJSON;
