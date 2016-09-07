'use strict';

const path = require('path');
const async = require('async');
const dest = require('../utils/dest');
const installTextFiles = require('./install-text-files');
const installBinaryFiles = require('./install-binary-files');
const installCNAME = require('./install-cname');
const installDotfiles = require('./install-dotfiles');
const installStylesheetFiles = require('./install-stylesheet-files');
const installJavascriptFiles = require('./install-javascript-files');
const mergeAndInstallPackageJSON = require('./merge-and-install-package-json');
const installNpm = require('./install-npm');

const TEMPLATE_SETTINGS = {
  evaluate: /\{SLUSH\{(.+?)\}\}/g,
  interpolate: /\{SLUSH\{=(.+?)\}\}/g,
  escape: /\{SLUSH\{-(.+?)\}\}/g
};

function installTheme(options) {
  const answers = options.answers;
  const defaults = options.defaults;
  const templatesDir = options.templatesDir;
  const cwd = options.cwd || process.cwd();
  const skipInstall = options.skipInstall;
  const srcDir = path.join(templatesDir, answers.theme);
  const destDir = dest(null, cwd);

  const opts = {
    answers,
    cwd,
    srcDir,
    destDir,
    templateSettings: TEMPLATE_SETTINGS
  };

  const coreFiles = [
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

  let jsFramework = answers.framework;
  if (jsFramework === 'concise') {
    jsFramework = 'blank';
  }

  const tasks = [
    installTextFiles(Object.assign(opts, {
      src: coreFiles
    })),
    installBinaryFiles(Object.assign(opts, {
      src: coreFiles
    })),
    installDotfiles(Object.assign(opts, {})),
    installStylesheetFiles(Object.assign(opts, {
      src: `_assets/stylesheets/${answers.framework}/**/*`
    })),
    installJavascriptFiles(Object.assign(opts, {
      src: `_assets/javascripts/${jsFramework}/**/*`
    })),
    mergeAndInstallPackageJSON(Object.assign(opts, {
      src: 'package.json',
      target: defaults.pkg
    }))
  ];

  if (answers.hostname) {
    tasks.push(installCNAME(Object.assign(opts, {})));
  }

  if (!skipInstall) {
    tasks.push(installNpm(Object.assign(opts, {})));
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

module.exports = installTheme;
