'use strict';

const fs = require('fs');
const iniparser = require('iniparser');
const moment = require('moment-timezone');
const trim = require('lodash/trim');
const yaml = require('js-yaml');
const slugify = require('./slugify');
const format = require('./format');
const dest = require('./dest');

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
  if (fs.existsSync(configFile)) {
    user = iniparser.parseSync(configFile).user || {};
  }

  let userName = format(user.name) || osUserName;
  let authorEmail = user.email || '';

  let pkg;
  if (fs.existsSync(dest('package.json'))) {
    pkg = require(dest('package.json'));
  }

  let githubToken;
  if (fs.existsSync(dest('.githubtoken'))) {
    githubToken = trim(fs.readFileSync(dest('.githubtoken'), 'utf8'));
  }

  let hostname;
  if (fs.existsSync(dest('CNAME'))) {
    hostname = trim(fs.readFileSync(dest('CNAME'), 'utf8'));
  }

  let config;
  if (fs.existsSync(dest('_config.yml'))) {
    try {
      config = yaml.safeLoad(fs.readFileSync(dest('_config.yml'), 'utf8'));
    } catch (e) {}
  }

  let authors;
  if (fs.existsSync(dest('_data/authors.yml'))) {
    try {
      authors = yaml.safeLoad(fs.readFileSync(dest('_data/authors.yml'), 'utf8'));
    } catch (e) {}
  }

  let branch = 'gh-pages';
  if (fs.existsSync(dest('.travis.yml'))) {
    try {
      const travis = yaml.safeLoad(fs.readFileSync(dest('.travis.yml'), 'utf8'));
      branch = travis.branches.only[0];
    } catch (e) {}
  }

  let name = workingDirName;
  if (config && config.title) {
    name = config.title;
  } else if (pkg && pkg.name) {
    name = pkg.name;
  }

  let description;
  if (config && config.description) {
    description = config.description;
  } else if (pkg && pkg.description) {
    description = pkg.description;
  }

  let url;
  if (config && config.url) {
    url = config.url;
  } else if (pkg && pkg.homepage) {
    url = pkg.homepage;
  }

  let author = userName;
  let twitter;

  if (authorEmail) {
    author += ` <${authorEmail}>`;
  }
  if (config && authors && authors[config.author]) {
    const siteAuthor = authors[config.author];
    author = `${config.author} <${siteAuthor.email}>`;
    twitter = siteAuthor.twitter;
  } else if (pkg && pkg.author) {
    author = pkg.author;
  }

  return {
    name,
    description,
    url,
    slug: slugify(workingDirNoExt),
    author,
    twitter,
    userName: format(user.name) || osUserName,
    authorEmail: user.email || '',
    timezone: moment.tz.guess(),
    pkg,
    githubToken,
    hostname,
    config,
    branch
  };
}

module.exports = getDefaults;
