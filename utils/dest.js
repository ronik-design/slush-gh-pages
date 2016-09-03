'use strict';

const path = require('path');

function dest(filepath, cwd) {
  return path.resolve(cwd || process.cwd(), filepath || './');
}

module.exports = dest;
