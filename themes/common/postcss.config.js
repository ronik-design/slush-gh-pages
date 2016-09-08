'use strict';

const config = {
  use: [
    'autoprefixer'
  ],
  autoprefixer: {
    browsers: '> 5%'
  },
  'postcss-urlrev': {
    relativePath: 'assets/stylesheets',
    absolutePath: __dirname
  }
};

if (process.env.NODE_ENV === 'production') {
  config.use.push('postcss-urlrev');
  config.use.push('cssnano');
}

module.exports = config;
