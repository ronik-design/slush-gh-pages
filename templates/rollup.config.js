import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
const {NODE_ENV} = process.env;

export default {
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
