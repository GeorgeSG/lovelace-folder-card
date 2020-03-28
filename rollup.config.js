import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import babel from "rollup-plugin-babel";

export default {
  input: ["src/folder-card.ts"],
  output: {
    dir: "./dist",
    format: "es"
  },
  plugins: [
    nodeResolve(),
    typescript(),
    babel({
      exclude: "node_modules/**"
    }),
    terser()
  ]
};
