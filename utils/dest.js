'use strict';

const path = require('path');

function dest(filepath) {
  return path.resolve(process.cwd(), filepath || './');
}

module.exports = dest;
