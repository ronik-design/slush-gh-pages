'use strict';

const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify');

// Necessary for certain global includes, like Bootstrap/Tether
const requireFix = function () {
  return {
    intro: () => 'var require;'
  };
};

const config = {
  plugins: [
    nodeResolve(),
    commonjs(),
    requireFix(),
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**'
    })
  ],
  format: 'cjs'
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(uglify());
}

module.exports = config;
