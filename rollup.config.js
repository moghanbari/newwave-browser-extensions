import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'src/js/popup.js',
    output: {
      name: 'popup',
      file: 'dist/js/popup.js',
      format: 'umd',
    },
    plugins: [
      process.env.prod && terser(),
      resolve(),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
      }),
    ],
  },
  {
    input: 'src/js/settings.js',
    output: {
      name: 'settings',
      file: 'dist/js/settings.js',
      format: 'umd',
    },
    plugins: [
      resolve(),
      process.env.prod && terser(),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
      }),
      copy({
        targets: [
          {
            src: [
              'src/assets/img',
              'src/assets/styles',
              'src/manifest.json',
              'src/popup.html',
              'src/settings.html',
            ],
            dest: 'dist',
          },
          { src: ['src/js/jsoneditor-minimalist.js'], dest: 'dist/js' },
        ],
      }),
    ],
  },
];
