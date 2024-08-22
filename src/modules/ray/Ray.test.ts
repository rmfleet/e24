import {
	describe,
	expect,
	it
} from "vitest";
import { Ray } from "./Ray.js";
import { Vector } from "../vector/Vector.js";

describe("Ray", () => {
	it("should be able to create a new Ray", () => {
		const ray = new Ray(new Vector(1, 2, 3), new Vector(4, 5, 6));
		expect(ray).toBeDefined();
	});
});
