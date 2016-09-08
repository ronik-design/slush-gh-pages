'use strict';

const gulp = require('gulp');
const template = require('gulp-template');
const conflict = require('gulp-conflict');
const jeditor = require('gulp-json-editor');
const merge = require('lodash/fp/merge');
const gulpIf = require('gulp-if');
const fileStat = require('../utils/file-stat');

const mergePackageJSON = function (options) {
  const answers = options.answers;
  const srcDir = options.srcDir;
  const destDir = options.destDir;
  const templateSettings = options.templateSettings;
  const checkExisting = options.checkExisting;
  const target = options.target;
  const source = options.source;

  return function (cb) {
    const pkgMerge = pkg => {
      if (target && fileStat(target)) {
        const targetPkg = require(target);
        return merge(targetPkg, pkg);
      }
      if (source && fileStat(source)) {
        const sourcePkg = require(source);
        return merge(pkg, sourcePkg);
      }
      return pkg;
    };

    gulp.src('package.json', {cwd: srcDir, base: srcDir})
      .pipe(template(answers, templateSettings))
      .pipe(jeditor(pkgMerge, {
        indent_char: ' ', // eslint-disable-line
        indent_size: 2 // eslint-disable-line
      }))
      .pipe(gulpIf(checkExisting, conflict(destDir, {logger: console.log})))
      .pipe(gulp.dest(destDir))
      .on('end', cb);
  };
};

module.exports = mergePackageJSON;
