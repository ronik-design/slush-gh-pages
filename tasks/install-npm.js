'use strict';

const npmInstall = require('../utils/npm-install');

const installNpm = function (options) {
  const cwd = options.cwd;
  return function (cb) {
    npmInstall(cwd, cb);
  };
};

module.exports = installNpm;
