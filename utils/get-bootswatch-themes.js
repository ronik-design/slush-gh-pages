'use strict';

const axios = require('axios');
const slugify = require('./slugify');

function getBootswatchThemes() {
  const request = axios.create({
    baseURL: 'https://bootswatch.com/api/',
    timeout: 1500
  });

  return request.get('3.json')
    .then(response => {
      return response.data.themes.map(theme => (
        {
          name: `${theme.name}: ${theme.description}`,
          value: slugify(theme.name)
        }
      ));
    })
    .catch(err => {
      console.error(err.message);
      console.log('Could not fetch Bootswatch list, moving on...');
    });
}

module.exports = getBootswatchThemes;
