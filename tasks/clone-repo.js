'use strict';

const chalk = require('chalk');
const clone = require('nodegit').Clone;

const cloneRepo = function (options) {
  const answers = options.answers;
  const repo = options.repo;
  const branch = options.branch;
  const destDir = options.destDir;

  return function (cb) {
    console.log(chalk.blue('--Cloning repo theme files--'));
    console.log(`Cloning ${chalk.magenta(answers.theme)}`);
    clone(
      repo,
      destDir,
      {checkoutBranch: branch}
    )
    .then(() => cb())
    .catch(cb);
  };
};

module.exports = cloneRepo;
