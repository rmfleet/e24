import {
	describe,
	expect,
	it
} from "vitest";
import { Plane } from "./Plane.js";

describe("Matrix", () => {
	it("should be able to create a new Plane", () => {
		const plane = new Plane();
		expect(plane).toBeDefined();
		expect(plane.a).toBe(0);
		expect(plane.b).toBe(0);
		expect(plane.c).toBe(0);
		expect(plane.d).toBe(0);
	});

	it("should be able to normalize a plane", () => {
		const plane = new Plane();
		plane.a = 1;
		plane.b = 2;
		plane.c = 3;
		plane.d = 4;
		plane.normalize();
		expect(plane.a).toBeCloseTo(0.2672612419124244);
		expect(plane.b).toBeCloseTo(0.5345224838248488);
		expect(plane.c).toBeCloseTo(0.8017837257372732);
		expect(plane.d).toBeCloseTo(1.0690449676496976);
	});
});
