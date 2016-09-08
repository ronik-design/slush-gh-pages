'use strict';

const path = require('path');
const gulp = require('gulp');
const through = require('through2');
const trim = require('lodash/trim');

function renamer(renamePaths) {
  const transform = function (file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isStream()) {
      return cb(new Error('Streaming not supported'));
    }

    const relPath = trim(file.path.replace(file.base, ''), '/');
    if (renamePaths && renamePaths[relPath]) {
      file.path = path.join(file.base, renamePaths[relPath]);
    }

    cb(null, file);
  };
  return through.obj(transform);
}

const copyFiles = function (options) {
  const src = options.src;
  const srcDir = options.srcDir;
  const destDir = options.destDir;
  const renamePaths = options.rename;

  return function (cb) {
    gulp.src(src, {dot: true, cwd: srcDir, base: srcDir})
      .pipe(renamer(renamePaths))
      .pipe(gulp.dest(destDir))
      .on('end', cb);
  };
};

module.exports = copyFiles;
