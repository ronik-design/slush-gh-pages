'use strict';

function parseGithubRepo(str) {
  const re = /(?:https?:\/\/github.com)?\/?([^\/.]+\/[^\/]+)(?:\.git)?$/i;
  const match = str.match(re);

  if (match && match[1]) {
    return match[1].replace(/\.git$/, '');
  }

  return null;
}

module.exports = parseGithubRepo;
