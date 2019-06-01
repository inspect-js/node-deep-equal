/* eslint-env node */

import babel from 'rollup-plugin-babel';
import {terser} from 'rollup-plugin-terser';

/**
 * @external RollupConfig
 * @type {PlainObject}
 * @see {@link https://rollupjs.org/guide/en#big-list-of-options}
 */

/**
 * @param {PlainObject} config
 * @param {boolean} config.minifying
 * @param {string} [config.format='umd'} = {}]
 * @returns {external:RollupConfig}
 */
function getRollupObject ({minifying, format = 'umd'} = {}) {
  const nonMinified = {
    input: 'index.js',
    output: {
      format,
      sourcemap: minifying,
      file: `dist/index-${format}${minifying ? '.min' : ''}.js`,
      name: 'deepEqual'
    },
    plugins: [
      babel()
    ]
  };
  if (minifying) {
    nonMinified.plugins.push(terser());
  }
  return nonMinified;
}

export default [
  getRollupObject({minifying: false, format: 'umd'}),
  getRollupObject({minifying: true, format: 'umd'}),
  getRollupObject({minifying: true, format: 'es'}),
  getRollupObject({minifying: false, format: 'es'}),
  {
    input: 'lib/is_arguments.js',
    output: {
      format: 'umd',
      file: `dist/is_arguments.js`,
      name: 'isArguments'
    },
    plugins: [
      babel()
    ]
    },
    {
      input: 'lib/keys.js',
      output: {
        format: 'umd',
        file: `dist/keys.js`,
        name: 'objectKeys'
      },
      plugins: [
        babel()
      ]
    }
];
