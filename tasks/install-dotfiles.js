'use strict';

const gulp = require('gulp');
const rename = require('gulp-rename');
const template = require('gulp-template');
const conflict = require('gulp-conflict');

const installTextFiles = function (options) {
  const answers = options.answers;
  const srcDir = options.srcDir;
  const destDir = options.destDir;
  const templateSettings = options.templateSettings;

  return function (cb) {
    const dotfiles = [
      '.*',
      '**/.*',
      '__*',
      '**/__*',
      '!__tests__',
      '!.DS_Store'
    ];

    if (!answers.githubtoken) {
      dotfiles.push('!__githubtoken');
    }

    gulp.src(dotfiles, {cwd: srcDir, base: srcDir})
      .pipe(rename(path => {
        path.basename = path.basename.replace('__', '.');
      }))
      .pipe(template(answers, templateSettings))
      .pipe(conflict(destDir, {logger: console.log}))
      .pipe(gulp.dest(destDir))
      .on('end', cb);
  };
};

module.exports = installTextFiles;
