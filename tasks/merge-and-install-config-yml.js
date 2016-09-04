'use strict';

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const gulpYaml = require('gulp-yaml');
const chalk = require('chalk');
const uniq = require('lodash/uniq');
const rename = require('gulp-rename');
const through = require('through2');
const template = require('gulp-template');
const conflict = require('gulp-conflict');
const yaml = require('js-yaml');
const defaultsDeep = require('lodash/defaultsDeep');
const jeditor = require('gulp-json-editor');
const fileStat = require('../utils/file-stat');

function toYAML() {
  const transform = function (file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isStream()) {
      return cb(new Error('Streaming not supported'));
    }

    const contents = JSON.parse(file.contents.toString());
    file.contents = new Buffer(yaml.safeDump(contents));
    cb(null, file);
  };
  return through.obj(transform);
}

const mergeAndInstallConfigYML = function (options) {
  const answers = options.answers;
  const src = options.src;
  const srcDir = options.srcDir;
  const destDir = options.destDir;
  const templateSettings = options.templateSettings;
  const targetFilename = options.target;

  return function (cb) {
    console.log(chalk.blue('--Installing _config.yml--'));

    const targetFile = path.join(destDir, targetFilename);
    let target;
    if (fileStat(targetFile)) {
      target = yaml.safeLoad(fs.readFileSync(targetFile, 'utf8'));
    }
    const configMerge = config => {
      if (target) {
        const merged = defaultsDeep(config, target);
        for (const property in config) {
          if (typeof config[property] === 'string' && !config[property]) {
            // Preserve empty strings, they matter
            merged[property] = '';
          }
        }
        if (config.exclude) {
          const excludes = (target.exclude || []).concat(config.exclude);
          merged.exclude = uniq(excludes);
        }
        return merged;
      }
      return config;
    };

    gulp.src(src, {cwd: srcDir, base: srcDir})
      .pipe(template(answers, templateSettings))
      .pipe(gulpYaml({safe: true}))
      .pipe(jeditor(configMerge, {
        indent_char: ' ', // eslint-disable-line
        indent_size: 2 // eslint-disable-line
      }))
      .pipe(toYAML())
      .pipe(rename({extname: '.yml'}))
      .pipe(conflict(destDir, {logger: console.log}))
      .pipe(gulp.dest(destDir))
      .on('end', cb);
  };
};

module.exports = mergeAndInstallConfigYML;
