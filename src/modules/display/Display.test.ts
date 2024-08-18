import {
	describe,
	expect,
	it
} from "vitest";
import { Display } from "./Display.js";
import { Canvas } from "../canvas/Canvas.js";

describe("Display", () => {
	it("should be able to create a new Display", () => {
		const canvas = new Canvas();
		const display = new Display(canvas);
		expect(display).toBeDefined();
	});
});
