'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const site = yaml.safeLoad(fs.readFileSync('./_config.yml', 'utf8'));

const config = {
  use: [
    'autoprefixer'
  ],
  autoprefixer: {
    browsers: '> 5%'
  },
  'postcss-urlrev': {
    relativePath: 'assets/stylesheets',
    absolutePath: __dirname,
    replacer: (url, hash) => {
      const baseurl = site.baseurl ? site.baseurl : '';
      return `${baseurl}${url}?${hash}`;
    }
  }
};

if (process.env.NODE_ENV === 'production') {
  config.use.push('postcss-urlrev');
  config.use.push('cssnano');
}

module.exports = config;
