'use strict';

const fs = require('fs');

function fileStat(filepath) {
  try {
    return fs.statSync(filepath);
  } catch (e) {}
}

module.exports = fileStat;
