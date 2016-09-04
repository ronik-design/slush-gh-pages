'use strict';

const chalk = require('chalk');
const npmInstall = require('../utils/npm-install');

const installNpm = function (options) {
  const cwd = options.cwd;
  return function (cb) {
    console.log(chalk.blue('--Installing npm modules--'));
    npmInstall(cwd, cb);
  };
};

module.exports = installNpm;
