'use strict';

const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify');

const NODE_ENV = process.env.NODE_ENV;

module.exports = {
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**'
    }),
    NODE_ENV === 'production' ? uglify() : {}
  ],
  format: 'cjs'
};
