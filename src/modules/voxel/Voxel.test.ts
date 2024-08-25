import {
	describe,
	expect,
	it
} from "vitest";
import { Voxel } from "./Voxel.js";
import { Vector } from "../vector/Vector.js";

describe("Voxel", () => {
	it("should be able to create a new Voxel", () => {
		const voxel = new Voxel(new Vector(1, 2, 3), 1);
		expect(voxel).toBeDefined();
		expect(voxel.position).toEqual(new Vector(1, 2, 3));
	});
});
