'use strict';

const path = require('path');
const urlParse = require('url').parse;
const async = require('async');
const chalk = require('chalk');
const merge = require('lodash/fp/merge');
const dest = require('../utils/dest');
const installTextFiles = require('./install-text-files');
const installBinaryFiles = require('./install-binary-files');
const installCNAME = require('./install-cname');
const installDotfiles = require('./install-dotfiles');
const mergePackageJSON = require('./merge-package-json');
const installNpm = require('./install-npm');
const copyFiles = require('./copy-files');
const cloneRepo = require('./clone-repo');
const cleanup = require('./cleanup');

const TEMPLATE_SETTINGS = {
  evaluate: /\{SLUSH\{(.+?)\}\}/g,
  interpolate: /\{SLUSH\{=(.+?)\}\}/g,
  escape: /\{SLUSH\{-(.+?)\}\}/g
};

function installTheme(options) {
  const answers = options.answers;
  const themesDir = options.themesDir;
  const themesTmpDir = options.themesTmpDir;
  const cwd = options.cwd || process.cwd();
  const skipInstall = options.skipInstall;
  const destDir = dest(null, cwd);

  const commonDir = path.join(themesDir, 'common');
  const themeDir = path.join(themesTmpDir, 'theme');
  const combineDir = path.join(themesTmpDir, 'build');
  const currentDir = destDir;

  const opts = {
    answers,
    cwd,
    templateSettings: TEMPLATE_SETTINGS
  };

  const coreFiles = [
    '**/*',
    '!CNAME',
    '!__*',
    '!**/__*',
    '!package.json'
  ];

  const parsed = urlParse(answers.theme);
  const branch = parsed.hash.substr(1);

  let tasks = [
    cb => {
      console.log(chalk.blue('--Cloning theme repo--'));
      cb();
    },
    cloneRepo(merge(opts, {
      repo: `https://github.com${parsed.path}`,
      branch,
      destDir: themeDir
    })),
    cb => {
      console.log(chalk.blue('--Copying theme files--'));
      cb();
    },
    copyFiles(merge(opts, {
      src: ['**/*'],
      srcDir: commonDir,
      destDir: combineDir
    })),
    copyFiles(merge(opts, {
      src: ['**/*', '!package.json'],
      srcDir: themeDir,
      destDir: combineDir
    })),
    mergePackageJSON(merge(opts, {
      srcDir: combineDir,
      destDir: combineDir,
      source: path.join(themeDir, 'package.json')
    })),
    cb => {
      console.log(chalk.blue('--Installing text files--'));
      cb();
    },
    installTextFiles(merge(opts, {
      src: coreFiles,
      srcDir: combineDir,
      destDir: currentDir
    })),
    cb => {
      console.log(chalk.blue('--Installing binary files--'));
      cb();
    },
    installBinaryFiles(merge(opts, {
      src: coreFiles,
      srcDir: combineDir,
      destDir: currentDir
    })),
    cb => {
      console.log(chalk.blue('--Installing dotfiles--'));
      cb();
    },
    installDotfiles(merge(opts, {
      srcDir: combineDir,
      destDir: currentDir
    })),
    cb => {
      console.log(chalk.blue('--Installing package.json--'));
      cb();
    },
    mergePackageJSON(merge(opts, {
      srcDir: combineDir,
      destDir: currentDir,
      target: path.join(currentDir, 'package.json'),
      checkExisting: true
    }))
  ];

  if (answers.hostname) {
    tasks = tasks.concat([
      cb => {
        console.log(chalk.blue('--Installing CNAME--'));
        cb();
      },
      installCNAME(merge(opts, {
        srcDir: combineDir,
        destDir: currentDir
      }))
    ]);
  }

  tasks = tasks.concat([
    cb => {
      console.log(chalk.blue('--Cleaning up--'));
      cb();
    },
    cleanup(merge(opts, {srcDir: themesTmpDir}))
  ]);

  if (!skipInstall) {
    tasks = tasks.concat([
      cb => {
        console.log(chalk.blue('--Installing npm modules--'));
        cb();
      },
      installNpm(opts)
    ]);
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
