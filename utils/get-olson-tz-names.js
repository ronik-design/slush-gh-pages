'use strict';

const tzData = require('moment-timezone/data/packed/latest.json');

function getOlsonTZNames() {
  return tzData.zones.map(zone => zone.split('|')[0]);
}

module.exports = getOlsonTZNames;
