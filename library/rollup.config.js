import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import { apiExtractor } from "rollup-plugin-api-extractor";
import { terser } from "rollup-plugin-terser";
import packageJson from "./package.json";

const PROD = !!process.env.CI;

export default {
  input: "src/index.ts",
  context: "globalThis",
  external: [/@dcl\//, /@decentraland\//, /^eth-connect/],
  output: [
    {
      file: packageJson.main,
      format: "amd",
      amd: {
        id: packageJson.name,
      },
    },
  ],
  plugins: [
    json(),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      preventAssignment: true,
    }),
    resolve({
      preferBuiltins: false,
      browser: true,
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      sourceMap: false,
      compilerOptions: {
        sourceMap: false,
        inlineSourceMap: false,
        inlineSources: false,
      },
    }),
    commonjs({
      ignoreGlobal: true,
    }),
    true && terser({ format: { comments: false } }),
    apiExtractor({
      configFile: "./api-extractor.json",
      configuration: {
        projectFolder: ".",
        compiler: {
          tsconfigFilePath: "<projectFolder>/tsconfig.json",
        },
      },
      local: !PROD,
      cleanUpRollup: false,
    }),
  ],
};