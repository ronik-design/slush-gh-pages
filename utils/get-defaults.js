'use strict';

const iniparser = require('iniparser');
const moment = require('moment-timezone');
const slugify = require('./slugify');
const format = require('./format');

function getDefaults() {
  const homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
  const workingDirName = process.cwd().split('/').pop().split('\\').pop();
  const workingDirNoExt = workingDirName.replace(/\.[a-z]{2,3}$/, '');

  let osUserName;
  if (homeDir && homeDir.split('/').pop()) {
    osUserName = homeDir.split('/').pop();
  } else {
    osUserName = 'root';
  }

  const configFile = `${homeDir}/.gitconfig`;

  let user = {};

  if (require('fs').existsSync(configFile)) {
    user = iniparser.parseSync(configFile).user || {};
  }

  return {
    name: workingDirName,
    slug: slugify(workingDirNoExt),
    userName: format(user.name) || osUserName,
    authorEmail: user.email || '',
    timezone: moment.tz.guess()
  };
}

module.exports = getDefaults;
