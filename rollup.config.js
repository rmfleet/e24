import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import copy from "rollup-plugin-copy";
import scss from "rollup-plugin-scss";

const sourcemap = (process.env.NODE_ENV !== "production");

export default {
	input: "src/public/app.ts",
	output: {
		format: "esm",
		file: "./dist/public/app.js",
		name: "app",
		sourcemap: sourcemap
	},
	plugins: [
		typescript({
			sourceMap: sourcemap,
			tsconfig: "./tsconfig.json"
		}),
		terser(),
		scss({
			fileName: "app.css"
		}),
		copy({
			targets: [
				{
					src: "./src/public/index.html",
					dest: "./dist/public"
				},
				{
					src: "./src/public/meshes",
					dest: "./dist/public"
				},
				{
					src: "./src/public/shaders",
					dest: "./dist/public"
				},
				{
					src: "./src/public/textures",
					dest: "./dist/public"
				}
			]
		})
	]
};
