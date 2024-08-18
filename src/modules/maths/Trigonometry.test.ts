import {
	describe,
	expect,
	it
} from "vitest";
import { degreeToRadian } from "./Trigonometry.js";

describe("Trigonometry", () => {
	it("should be able to convert degrees to radians", () => {
		expect(degreeToRadian(0)).toBe(0);
		expect(degreeToRadian(45)).toBeCloseTo(0.7853981633974483);
		expect(degreeToRadian(90)).toBeCloseTo(1.5707963267948966);
		expect(degreeToRadian(180)).toBeCloseTo(3.141592653589793);
		expect(degreeToRadian(270)).toBeCloseTo(4.71238898038469);
		expect(degreeToRadian(360)).toBeCloseTo(6.283185307179586);
	});
});
