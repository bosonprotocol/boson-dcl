import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { apiExtractor } from "rollup-plugin-api-extractor";
import { terser } from 'rollup-plugin-terser';
import packageJson from './package.json'

const PROD = !!process.env.CI

export default {
  input: 'src/index.ts',
  context: 'globalThis',
  external: [/@dcl\//, /@decentraland\//],
  output: [
    {
      file: packageJson.main,
      format: 'amd',
      amd: {
        id: packageJson.name
      },
    },
  ],
  plugins: [
    resolve({
      preferBuiltins: false,
      browser: true
    }),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: false,
      compilerOptions: {
        sourceMap: false,
        inlineSourceMap: false,
        inlineSources: false
      },
    }),
    commonjs({
      exclude: 'node_modules',
      ignoreGlobal: true,
    }),
    true && terser({ format: { comments: false } }),
    apiExtractor({
      configFile: './api-extractor.json',
      configuration: {
        projectFolder: '.',
        compiler: {
          tsconfigFilePath: "<projectFolder>/tsconfig.json",
        },
      },
      local: !PROD,
      cleanUpRollup: false
    })
  ],
};