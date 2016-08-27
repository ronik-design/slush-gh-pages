'use strict';

const kebabCase = require('lodash/kebabCase');
const trim = require('lodash/trim');
const deburr = require('lodash/deburr');

function slugify(str) {
  return kebabCase(trim(deburr(str).replace(/[^\x00-\x7F]/g, '')));
}

module.exports = slugify;
