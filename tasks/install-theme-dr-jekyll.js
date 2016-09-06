'use strict';

const path = require('path');
const async = require('async');
const urlParse = require('url').parse;
const inquirer = require('inquirer');
const dest = require('../utils/dest');
const cloneRepo = require('./clone-repo');
const downloadAndUnzip = require('./download-and-unzip');
const copyFiles = require('./copy-files');
const deleteFiles = require('./delete-files');
const installTextFiles = require('./install-text-files');
const installDotfiles = require('./install-dotfiles');
const installCNAME = require('./install-cname');
const mergeAndInstallPackageJSON = require('./merge-and-install-package-json');
const mergeAndInstallConfigYML = require('./merge-and-install-config-yml');
const installNpm = require('./install-npm');

const TMP_DIR = '.slush-gh-pages-tmp';

const TEMPLATE_SETTINGS = {
  evaluate: /\{SLUSH\{(.+?)\}\}/g,
  interpolate: /\{SLUSH\{=(.+?)\}\}/g,
  escape: /\{SLUSH\{-(.+?)\}\}/g
};

function installThemeDrJekyll(options) {
  const answers = options.answers;
  const defaults = options.defaults;
  const templatesDir = options.templatesDir;
  const cwd = options.cwd || process.cwd();
  const skipInstall = options.skipInstall;
  const srcDir = path.join(templatesDir, 'drjekyll');
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
    '!CNAME',
    '!__*',
    '!**/__*',
    '!_config.yml',
    '!package.json'
  ];

  let tasks = [];

  const parsed = urlParse(answers.theme);

  if (path.extname(parsed.path) === '.git') {
    const branch = parsed.hash.substr(1);
    tasks = tasks.concat([
      cloneRepo(Object.assign(opts, {
        repo: `https://github.com${parsed.path}`,
        branch,
        destDir: `${destDir}/${TMP_DIR}`
      })),
      copyFiles(Object.assign(opts, {
        src: ['**/*', '!.git', '!.git/**', '!Gemfile.lock'],
        srcDir: `${destDir}/${TMP_DIR}`,
        destDir,
        rename: {Gemfile: 'Gemfile.drjekyll'}
      }))
    ]);
  } else {
    const downloadedDir = 'downloaded';
    tasks = tasks.concat([
      downloadAndUnzip(Object.assign(opts, {
        downloadUrl: answers.theme,
        destDir: `${destDir}/${TMP_DIR}`,
        downloadedDir
      })),
      copyFiles(Object.assign(opts, {
        src: ['**/*', '!.git', '!.git/**', '!*.zip', '!Gemfile.lock'],
        srcDir: `${destDir}/${TMP_DIR}/${downloadedDir}`,
        destDir,
        rename: {Gemfile: 'Gemfile.drjekyll'}
      }))
    ]);
  }

  tasks.push(deleteFiles(Object.assign(opts, {
    src: TMP_DIR,
    srcDir: destDir
  })));

  tasks = tasks = tasks.concat([
    installTextFiles(Object.assign(opts, {
      src: coreFiles,
      srcDir: path.join(templatesDir, 'drjekyll')
    })),
    installDotfiles(Object.assign(opts, {
      srcDir: path.join(templatesDir, 'drjekyll')
    })),
    mergeAndInstallConfigYML(Object.assign(opts, {
      src: '_config.yml',
      target: '_config.yml',
      destDir
    })),
    mergeAndInstallPackageJSON(Object.assign(opts, {
      src: 'package.json',
      srcDir: path.join(templatesDir, 'drjekyll'),
      target: defaults.pkg
    }))
  ]);

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

module.exports = installThemeDrJekyll;
