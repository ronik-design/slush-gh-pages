'use strict';

const del = require('del');

const cleanup = function (options) {
  const srcDir = options.srcDir;
  return function (cb) {
    del(srcDir).then(() => cb());
  };
};

module.exports = cleanup;
