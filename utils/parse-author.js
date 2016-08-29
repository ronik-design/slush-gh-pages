'use strict';

function parseAuthor(authorStr) {
  const authorEmailMatch = authorStr.match(/(<(.+)>)/);
  const authorName = authorEmailMatch ? authorStr.replace(authorEmailMatch[1], '').trim() : authorStr.trim();
  return {
    authorName,
    authorEmail: authorEmailMatch ? authorEmailMatch[2] : ''
  };
}

module.exports = parseAuthor;
