'use strict';

const fs = require('fs');
const iniparser = require('iniparser');
const moment = require('moment-timezone');
const trim = require('lodash/trim');
const yaml = require('js-yaml');
const format = require('./format');
const dest = require('./dest');
const fileStat = require('./file-stat');
const parseAuthor = require('./parse-author');

function getDefaults() {
  const homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

  let osUserName;
  if (homeDir && homeDir.split('/').pop()) {
    osUserName = homeDir.split('/').pop();
  } else {
    osUserName = 'root';
  }

  const configFileLocal = `${homeDir}/.gitconfig.local`;
  const configFile = `${homeDir}/.gitconfig`;

  let user;

  if (fileStat(configFileLocal)) {
    user = iniparser.parseSync(configFileLocal).user;
  }

  if (!user && fileStat(configFile)) {
    user = iniparser.parseSync(configFile).user;
  }

  user = user || {};

  let authorName = format(user.name) || osUserName;
  let authorEmail = user.email || '';

  let pkg;
  if (fileStat(dest('package.json'))) {
    pkg = require(dest('package.json'));
  }

  let githubToken;
  if (fileStat(dest('.githubtoken'))) {
    githubToken = trim(fs.readFileSync(dest('.githubtoken'), 'utf8'));
  }

  let hostname;
  if (fileStat(dest('CNAME'))) {
    hostname = trim(fs.readFileSync(dest('CNAME'), 'utf8'));
  }

  let config;
  if (fileStat(dest('_config.yml'))) {
    try {
      config = yaml.safeLoad(fs.readFileSync(dest('_config.yml'), 'utf8'));
    } catch (e) {}
  }

  let authors;
  if (fileStat(dest('_data/authors.yml'))) {
    try {
      authors = yaml.safeLoad(fs.readFileSync(dest('_data/authors.yml'), 'utf8'));
    } catch (e) {}
  }

  let branch;
  if (fileStat(dest('.travis.yml'))) {
    try {
      const travis = yaml.safeLoad(fs.readFileSync(dest('.travis.yml'), 'utf8'));
      branch = travis.branches.only[0];
    } catch (e) {}
  }

  let name;
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

  let author;
  let authorStr = '';
  let authorTwitter = '';

  if (authorName) {
    authorStr += authorName;
  }

  if (authorEmail) {
    authorStr += ` <${authorEmail}>`;
  }

  if (config && config.author && typeof config.author === 'string') {
    authorName = config.author;
  } else if (config && config.author && typeof config.author === 'object') {
    author = config.author;
    authorName = author.name;
    authorEmail = author.email;
    authorTwitter = author.twitter;
    authorStr = `${authorName} <${authorEmail}>`;
  }

  if (authorName && authors && authors[authorName]) {
    author = authors[authorName];
    authorEmail = author.email;
    authorTwitter = author.twitter;
    authorStr = `${authorName} <${authorEmail}>`;
  } else if (pkg && pkg.author && typeof pkg.author === 'string') {
    author = parseAuthor(pkg.author);
    authorName = author.authorName;
    authorEmail = author.authorEmail;
    authorStr = `${authorName} <${authorEmail}>`;
  } else if (pkg && pkg.author && typeof pkg.author === 'object') {
    author = pkg.author;
    authorName = author.name;
    authorEmail = author.email;
    authorStr = `${authorName} <${authorEmail}>`;
  }

  const gitDirStats = fileStat(dest('.git'));
  const repoPresent = gitDirStats && gitDirStats.isDirectory();

  return {
    name,
    description,
    url,
    author: authorStr,
    authorTwitter,
    authorName,
    authorEmail,
    timezone: moment.tz.guess(),
    pkg,
    githubToken,
    hostname,
    config,
    branch,
    repoPresent
  };
}

module.exports = getDefaults;
