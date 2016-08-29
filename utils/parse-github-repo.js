'use strict';

function parseGithubRepo(repoStr) {
  const repoParts = repoStr.match(/([^\/].+)\/(.+)/);
  const githubAuthorName = repoParts ? repoParts[1].trim() : '';
  return {
    githubAuthorName,
    githubAuthorUrl: `https://github.com/${githubAuthorName}`,
    githubRepoName: repoParts ? repoParts[2].trim() : '',
    githubRepoUrl: `https://github.com/${repoStr}`
  };
}

module.exports = parseGithubRepo;
