import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [
	],
	test: {
		root: "./",
		include: ["src/**/*.test.ts"],
		globals: true,
		environment: "jsdom",
		globalSetup: ["./tests/setup.ts"],
		maxConcurrency: 5,
		coverage: {
			enabled: false,
			provider: "v8",
			reporter: [
				"text",
				"html"
			],
			all: true,
			include: ["src/**/*.ts"],
			exclude: ["src/**/*.test.ts", "**/*.d.ts"],
			statements: 0,
			branches: 0,
			functions: 0,
			lines: 0,
			reportsDirectory: "./coverage"
		}
	}
});
