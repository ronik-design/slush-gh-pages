'use strict';

const gulp = require('gulp');
const async = require('async');
const conflict = require('gulp-conflict');
const ignore = require('gulp-ignore');
const template = require('gulp-template');
const rename = require('gulp-rename');
const jeditor = require('gulp-json-editor');
const clone = require('lodash/clone');
const merge = require('lodash/merge');
const moment = require('moment-timezone');
const istextorbinary = require('istextorbinary');
const chalk = require('chalk');
const parseGithubRepo = require('../utils/parse-github-repo');
const dest = require('../utils/dest');
const npmInstall = require('../utils/npm-install');

const pkg = require('../package.json');

const TEMPLATE_SETTINGS = {
  evaluate: /\{SLUSH\{(.+?)\}\}/g,
  interpolate: /\{SLUSH\{=(.+?)\}\}/g,
  escape: /\{SLUSH\{-(.+?)\}\}/g
};

function handleAnswers(options) {
  const answers = options.answers;
  const defaults = options.defaults;
  const srcDir = options.srcDir;
  const cwd = options.cwd || process.cwd();
  const skipInstall = options.skipInstall;

  let config = clone(answers);

  // Add GitHub repo info
  config = Object.assign(config, parseGithubRepo(answers.github));

  // Add version of this generator
  config.generatorVersion = pkg.version;

  // Basic time info in selected timezone
  config.now = moment.tz(new Date(), answers.timezone).format('YYYY-MM-DD HH:mm:ss Z');
  config.year = moment.tz(new Date(), answers.timezone).format('YYYY');

  const destDir = dest(null, cwd);

  const handleLater = [
    '**/*',
    '!_assets/stylesheets',
    '!_assets/stylesheets/**',
    '!_assets/javascripts',
    '!_assets/javascripts/**',
    '!CNAME',
    '!__*',
    '!**/__*',
    '!package.json'
  ];

  const installTextFiles = function (cb) {
    console.log(chalk.blue('--Installing text files--'));
    const src = handleLater;
    gulp.src(src, {cwd: srcDir, base: srcDir})
      .pipe(ignore.include(file => istextorbinary.isTextSync(file.basename, file.contents)))
      .pipe(template(config, TEMPLATE_SETTINGS))
      .pipe(conflict(destDir, {logger: console.log}))
      .pipe(gulp.dest(destDir))
      .on('end', cb);
  };

  const installBinaryFiles = function (cb) {
    console.log(chalk.blue('--Installing binary files--'));
    const src = handleLater;
    gulp.src(src, {cwd: srcDir, base: srcDir})
      .pipe(ignore.include(file => istextorbinary.isBinarySync(file.basename, file.contents)))
      .pipe(conflict(destDir, {logger: console.log}))
      .pipe(gulp.dest(destDir))
      .on('end', cb);
  };

  const installDotfiles = function (cb) {
    console.log(chalk.blue('--Installing dotfiles--'));
    const dotfiles = [
      '__*',
      '**/__*',
      '!__tests__'
    ];

    if (!config.githubtoken) {
      dotfiles.push('!__githubtoken');
    }

    gulp.src(dotfiles, {cwd: srcDir, base: srcDir})
      .pipe(rename(path => {
        path.basename = path.basename.replace('__', '.');
      }))
      .pipe(template(config, TEMPLATE_SETTINGS))
      .pipe(conflict(destDir, {logger: console.log}))
      .pipe(gulp.dest(destDir))
      .on('end', cb);
  };

  const installStylesheetFiles = function (cb) {
    console.log(chalk.blue('--Installing stylesheets--'));
    const src = `_assets/stylesheets/${config.framework}/**/*`;
    gulp.src(src, {cwd: srcDir, base: srcDir})
      .pipe(template(config, TEMPLATE_SETTINGS))
      .pipe(rename(filepath => {
        filepath.dirname = filepath.dirname.replace(`/${config.framework}`, '');
        return;
      }))
      .pipe(conflict(destDir, {logger: console.log}))
      .pipe(gulp.dest(destDir))
      .on('end', cb);
  };

  const installJavascriptFiles = function (cb) {
    console.log(chalk.blue('--Installing javascripts--'));
    let jsFramework = config.framework;
    if (jsFramework === 'concise') {
      jsFramework = 'blank';
    }
    const src = `_assets/javascripts/${jsFramework}/**/*`;
    gulp.src(src, {cwd: srcDir, base: srcDir})
      .pipe(template(config, TEMPLATE_SETTINGS))
      .pipe(rename(filepath => {
        filepath.dirname = filepath.dirname.replace(`/${jsFramework}`, '');
        return;
      }))
      .pipe(conflict(destDir, {logger: console.log}))
      .pipe(gulp.dest(destDir))
      .on('end', cb);
  };

  const installCNAME = function (cb) {
    if (!config.hostname) {
      return cb();
    }
    console.log(chalk.blue('--Installing CNAME--'));
    gulp.src('CNAME', {cwd: srcDir, base: srcDir})
      .pipe(template(config, TEMPLATE_SETTINGS))
      .pipe(conflict(destDir, {logger: console.log}))
      .pipe(gulp.dest(destDir))
      .on('end', cb);
  };

  const installPackageJSON = function (cb) {
    console.log(chalk.blue('--Installing package.json--'));
    const pkgMerge = pkg => {
      if (defaults.pkg) {
        return merge(defaults.pkg, pkg);
      }
      return pkg;
    };

    gulp.src('package.json', {cwd: srcDir, base: srcDir})
      .pipe(template(config, TEMPLATE_SETTINGS))
      .pipe(jeditor(pkgMerge, {
        indent_char: ' ', // eslint-disable-line
        indent_size: 2 // eslint-disable-line
      }))
      .pipe(conflict(destDir, {logger: console.log}))
      .pipe(gulp.dest(destDir))
      .on('end', cb);
  };

  const install = function (cb) {
    console.log(chalk.blue('--Installing npm modules--'));
    npmInstall(cwd, cb);
  };

  const tasks = [
    installTextFiles,
    installBinaryFiles,
    installCNAME,
    installDotfiles,
    installStylesheetFiles,
    installJavascriptFiles,
    installPackageJSON
  ];

  if (!skipInstall) {
    tasks.push(install);
  }

  return new Promise((resolve, reject) => {
    async.series(tasks, err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

module.exports = handleAnswers;
module.exports.default = handleAnswers;
