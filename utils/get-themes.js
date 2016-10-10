'use strict';

const axios = require('axios');
const yaml = require('js-yaml');

const BASE_URL = 'https://raw.githubusercontent.com';
const TIMEOUT = 2000;

function getThemes() {
  const request = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
    transformResponse: [
      data => yaml.safeLoad(data),
      data => (data.map(theme => {
        let value;
        if (theme.github) {
          value = `https://github.com/${theme.github}.git#${theme.branch || 'master'}`;
        } else if (theme.download_url) {
          value = theme.download_url;
        }
        return {
          name: `${theme.title} -- by ${theme.author} (${theme.demo_url})`,
          value
        };
      }))
    ]
  });

  return request.get('/static-stuff/_registry/master/themes.yml')
    .then(response => response.data)
    .catch(err => {
      console.error(err.message);
      console.log('Could not fetch theme list...');
    });
}

module.exports = getThemes;
