'use strict';

function format(string) {
  if (string) {
    return string.toLowerCase().replace(/\s/g, '');
  }
  return '';
}

module.exports = format;
