'use strict';

const chalk = require('chalk');
const del = require('del');

const copyFiles = function (options) {
  const src = options.src;
  const srcDir = options.srcDir;

  return function (cb) {
    console.log(chalk.blue('--Cleaning up--'));
    del(src, {cwd: srcDir}).then(() => cb());
  };
};

module.exports = copyFiles;
