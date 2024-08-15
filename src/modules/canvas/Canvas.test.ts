import {
	describe,
	expect,
	it,
	vitest
} from "vitest";
import { Canvas } from "./Canvas.js";

describe("Canvas", () => {
	it("should be able to create a new Canvas", () => {
		const canvas = new Canvas();
		expect(canvas).toBeDefined();
	});

	it("should be able to get the aspect ratio of the Canvas", () => {
		const canvas = new Canvas();
		canvas.setDimensions(1080, 720);
		expect(canvas.getAspectRatio()).toBe(1.5);
	});

	it("should be able to get the HTMLCanvasElement of the Canvas", () => {
		const canvas = new Canvas();
		expect(canvas.getHTMLCanvasElement()).toBeDefined();
	});

	it("should be able to get the dimensions of the Canvas", () => {
		const canvas = new Canvas();
		canvas.setDimensions(1080, 720);
		expect(canvas.getDimensions()).toEqual({ width: 1080, height: 720 });
	});

	it("should be able to set the dimensions of the Canvas on a window resize", () => {
		const spySetDimensions = vitest.spyOn(Canvas.prototype, "setDimensions");
		window.innerWidth = 1280;
		window.innerHeight = 720;
		window.dispatchEvent(new Event("resize"));
		expect(spySetDimensions).toHaveBeenCalledWith(1280, 720);
		spySetDimensions.mockRestore();
	});
});
